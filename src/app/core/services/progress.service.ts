import { Injectable, inject } from '@angular/core';
import { PersistenceService } from './persistence.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private persistenceService = inject(PersistenceService);
  private watchedVideosSubject = new BehaviorSubject<string[]>([]);

  constructor() {
    this.loadInitialWatchedVideos();
  }

  private async loadInitialWatchedVideos(): Promise<void> {
    const watchedVideos = await this.persistenceService.getWatchedVideos();
    this.watchedVideosSubject.next(watchedVideos);
  }

  getWatchedVideos(): Observable<string[]> {
    return this.watchedVideosSubject.asObservable();
  }

  async markAsWatched(videoId: string): Promise<void> {
    await this.persistenceService.markAsWatched(videoId);
    const watchedVideos = await this.persistenceService.getWatchedVideos();
    this.watchedVideosSubject.next(watchedVideos);
  }

  async markAsUnwatched(videoId: string): Promise<void> {
    await this.persistenceService.markAsUnwatched(videoId);
    const watchedVideos = await this.persistenceService.getWatchedVideos();
    this.watchedVideosSubject.next(watchedVideos);
  }

  isWatched(videoId: string): Observable<boolean> {
    return this.watchedVideosSubject.pipe(
      map(watchedVideos => watchedVideos.includes(videoId))
    );
  }
}

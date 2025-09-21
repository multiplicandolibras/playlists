import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Playlist } from '../models/playlist.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);
  private playlistsCache$ = new BehaviorSubject<Playlist[] | null>(null);

  getPlaylists(): Observable<Playlist[]> {
    if (this.playlistsCache$.value) {
      return this.playlistsCache$.asObservable() as Observable<Playlist[]>;
    }
    return this.loadPlaylists();
  }

  getPlaylistById(id: string): Observable<Playlist | undefined> {
    return this.getPlaylists().pipe(
      map(playlists => playlists.find(p => p.id === id))
    );
  }

  reload(): Observable<Playlist[]> {
    return this.loadPlaylists();
  }

  private loadPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>('assets/playlists.json').pipe(
      tap(playlists => this.playlistsCache$.next(playlists))
    );
  }
}

import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { ProgressService } from '../../core/services/progress.service';
import { Playlist, Lesson } from '../../core/models/playlist.model';
import { Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.scss']
})
export class PlaylistDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private progressService = inject(ProgressService);
  private router = inject(Router);

  // signals
  playlist = signal<Playlist | undefined>(undefined);
  watched = signal<string[]>([]);
  loading = signal(true);

  private subs = new Subscription();

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading.set(false);
      return;
    }

    const playlist$ = this.dataService.getPlaylistById(id);
    const watchedVideos$ = this.progressService.getWatchedVideos();

    this.subs.add(
      combineLatest([playlist$, watchedVideos$]).subscribe(([playlist, watchedIds]) => {
        this.playlist.set(playlist);
        this.watched.set(watchedIds);
        this.loading.set(false);
      })
    );
  }

  isWatched(youtubeId: string): boolean {
    return this.watched().includes(youtubeId);
  }

  // trackBy functions for ngFor performance
  trackByModule(index: number, module: { id: string }): string {
    return module?.id;
  }

  trackByLesson(index: number, lesson: Lesson): string {
    return lesson.youtubeId;
  }

  async toggleWatched(youtubeId: string): Promise<void> {
    if (this.isWatched(youtubeId)) {
      await this.progressService.markAsUnwatched(youtubeId);
    } else {
      await this.progressService.markAsWatched(youtubeId);
    }
  }

  goBack(): void {
    this.router.navigate(['/playlists']);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

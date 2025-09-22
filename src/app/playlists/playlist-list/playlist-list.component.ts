import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { ProgressService } from '../../core/services/progress.service';
import { Playlist } from '../../core/models/playlist.model';
import { Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-playlist-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './playlist-list.component.html',
  styleUrls: ['./playlist-list.component.scss'],
})
export class PlaylistListComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private progressService = inject(ProgressService);
  private router = inject(Router);

  playlists: Array<Playlist & { progress?: number }> = [];
  loading = true;

  private subs = new Subscription();

  ngOnInit(): void {
    const playlists$ = this.dataService.getPlaylists();
    const watchedVideos$ = this.progressService.getWatchedVideos();

    this.subs.add(
      combineLatest([playlists$, watchedVideos$])
        .pipe(
          map(([playlists, watchedIds]) => {
            if (!playlists || playlists.length === 0) {
              this.playlists = [];
              this.loading = false;
              return;
            }

            this.playlists = playlists.map((p) => {
              const totalLessons =
                p.modules?.reduce((acc, m) => acc + (m.videos?.length || 0), 0) || 0;
              const seen =
                p.modules
                  ?.flatMap((m) => m.videos?.map((l) => l.youtubeId) || [])
                  .filter((id) => watchedIds.includes(id)) || [];
              const progress =
                totalLessons === 0 ? 0 : Math.round((seen.length / totalLessons) * 100);
              return { ...p, progress };
            });
            this.loading = false;
          })
        )
        .subscribe()
    );
  }

  openPlaylist(playlist: Playlist): void {
    this.router.navigate(['/playlists', playlist.id]);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

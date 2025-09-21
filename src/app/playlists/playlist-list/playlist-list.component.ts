import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { ProfileService } from '../../core/services/profile.service';
import { PersistenceService } from '../../core/services/persistence.service';
import { Playlist } from '../../core/models/playlist.model';
import { Subscription, combineLatest, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-playlist-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './playlist-list.component.html',
  styleUrls: ['./playlist-list.component.scss']
})
export class PlaylistListComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private profileService = inject(ProfileService);
  private persistenceService = inject(PersistenceService);
  private router = inject(Router);

  playlists: Array<Playlist & { progress?: number }> = [];
  loading = true;
  hasProfiles = false;

  private subs = new Subscription();

  ngOnInit(): void {
    const playlists$ = this.dataService.getPlaylists();
    const profile$ = this.profileService.getActiveProfile();

    this.subs.add(
      combineLatest([playlists$, profile$])
        .pipe(
          switchMap(([playlists, profile]) => {
            if (!playlists || playlists.length === 0) {
              this.playlists = [];
              this.loading = false;
              return of(null);
            }

            if (!profile) {
              // No active profile: set progress to 0 and indicate no profiles
              this.playlists = playlists.map(p => ({ ...p, progress: 0 }));
              this.loading = false;
              this.hasProfiles = false;
              return of(null);
            }

            this.hasProfiles = true;

            // For the active profile, fetch watched video ids and compute progress per playlist
            return from(this.persistenceService.getWatchedVideos(profile.id!)).pipe(
              map(watchedIds => {
                this.playlists = playlists.map(p => {
                  const totalLessons = p.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
                  const seen = p.modules?.flatMap(m => m.lessons?.map(l => l.id) || []).filter(id => watchedIds.includes(id)) || [];
                  const progress = totalLessons === 0 ? 0 : Math.round((seen.length / totalLessons) * 100);
                  return { ...p, progress };
                });
                this.loading = false;
              })
            );
          })
        )
        .subscribe()
    );
  }

  openPlaylist(playlist: Playlist): void {
    this.router.navigate(['/playlist', playlist.id]);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

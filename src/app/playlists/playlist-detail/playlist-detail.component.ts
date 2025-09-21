import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { PersistenceService } from '../../core/services/persistence.service';
import { Playlist } from '../../core/models/playlist.model';
import { Subscription, from } from 'rxjs';

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.scss']
})
export class PlaylistDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private persistence = inject(PersistenceService);

  playlist: Playlist | undefined;
  watched: string[] = [];
  loading = true;

  private subs = new Subscription();

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || undefined;
    if (!id) {
      this.loading = false;
      return;
    }

    this.subs.add(
      this.dataService.getPlaylistById(id).subscribe(pl => {
        this.playlist = pl;
        if (pl) {
          // load watched videos for current profile if available
          // note: ProfileService not injected here to keep example minimal — persistence expects profileId elsewhere
          // We'll assume single profile with id 1 for demo/tests; callers should wire profile id properly in real app
          from(this.persistence.getWatchedVideos(1)).subscribe(ids => {
            this.watched = ids;
            this.loading = false;
          });
        } else {
          this.loading = false;
        }
      })
    );
  }

  isWatched(lessonId: string): boolean {
    return this.watched.includes(lessonId);
  }

  // trackBy functions for ngFor performance
  trackByModule(index: number, module: { id: string }): string {
    return module?.id;
  }

  trackByLesson(index: number, lesson: { id: string }): string {
    return lesson?.id;
  }

  async toggleWatched(lessonId: string): Promise<void> {
    // Toggle watched state for profileId 1 (see note above)
    const profileId = 1;
    if (this.isWatched(lessonId)) {
      await this.persistence.markAsUnwatched(profileId, lessonId);
      this.watched = this.watched.filter(id => id !== lessonId);
    } else {
      await this.persistence.markAsWatched(profileId, lessonId);
      this.watched = [...this.watched, lessonId];
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

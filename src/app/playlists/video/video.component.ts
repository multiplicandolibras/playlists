import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { ProgressService } from '../../core/services/progress.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [CommonModule, YouTubePlayerModule],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dataService = inject(DataService);
  private progressService = inject(ProgressService);

  youtubeId = signal<string | undefined>(undefined);
  title = signal<string | undefined>(undefined);
  playlistId?: string;
  videoId?: string;

  private subs = new Subscription();

  ngOnInit(): void {
    this.playlistId = this.route.snapshot.paramMap.get('playlistId') || undefined;
    this.videoId = this.route.snapshot.paramMap.get('videoId') || undefined;

    if (!this.playlistId || !this.videoId) {
      return;
    }

    this.subs.add(
      this.dataService.getPlaylistById(this.playlistId).subscribe(pl => {
        if (!pl) return;
        // find lesson by videoId (lesson.id)
        const lesson = pl.modules?.flatMap(m => m.lessons || []).find(l => l.id === this.videoId);
        if (lesson) {
          this.youtubeId.set(lesson.youtubeId);
          this.title.set(lesson.title);
        }
      })
    );
  }

  onStateChange(event: any): void {
    // YT.PlayerState.ENDED === 0
    if (event?.data === 0) {
      if (this.videoId) {
        this.progressService.markAsWatched(this.videoId).catch(() => {
          // error handling can be added
        });
      }
    }
  }

  goBack(): void {
    if (this.playlistId) {
      this.router.navigate(['/playlists', this.playlistId]);
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
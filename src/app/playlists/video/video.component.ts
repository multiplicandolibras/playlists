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

  private subs = new Subscription();

  ngOnInit(): void {
    this.playlistId = this.route.snapshot.paramMap.get('playlistId') || undefined;
    const youtubeId = this.route.snapshot.paramMap.get('videoId') || undefined;

    if (!this.playlistId || !youtubeId) {
      return;
    }

    this.youtubeId.set(youtubeId);

    this.subs.add(
      this.dataService.getPlaylistById(this.playlistId).subscribe(pl => {
        if (!pl) return;
        const lesson = pl.modules?.flatMap(m => m.lessons || []).find(l => l.youtubeId === youtubeId);
        if (lesson) {
          this.title.set(lesson.title);
        }
      })
    );
  }

  onStateChange(event: any): void {
    // YT.PlayerState.ENDED === 0
    if (event?.data === 0) {
      const youtubeId = this.youtubeId();
      if (youtubeId) {
        this.progressService.markAsWatched(youtubeId).catch(() => {
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

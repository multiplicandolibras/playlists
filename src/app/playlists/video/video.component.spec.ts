import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VideoComponent } from './video.component';
import { DataService } from '../../core/services/data.service';
import { ProgressService } from '../../core/services/progress.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

// Stub component for youtube-player (standalone so it can be imported)
@Component({ selector: 'youtube-player', template: '', standalone: true })
class YoutubeStub {
  @Input() videoId: string | undefined;
  @Output() stateChange = new EventEmitter<any>();
}

describe('VideoComponent', () => {
  let fixture: ComponentFixture<VideoComponent>;
  let component: VideoComponent;
  let progressServiceSpy: any;

  const mockPlaylist = {
    id: 'p1',
    title: 'P1',
    modules: [
      { id: 'm1', title: 'M1', lessons: [{ title: 'V1', youtubeId: 'yt1' }] }
    ]
  };

  beforeEach(async () => {
    progressServiceSpy = { markAsWatched: jasmine.createSpy('markAsWatched').and.returnValue(Promise.resolve()) };

    await TestBed.configureTestingModule({
      imports: [VideoComponent, RouterTestingModule.withRoutes([]), YoutubeStub],
      providers: [
        { provide: DataService, useValue: { getPlaylistById: (id: string) => of(mockPlaylist) } },
        { provide: ProgressService, useValue: progressServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VideoComponent);
    component = fixture.componentInstance;
    // Provide route snapshot params via a fake ActivatedRoute
    const fakeRoute = TestBed.inject(ActivatedRoute);
    (fakeRoute as any).snapshot = { paramMap: { get: (k: string) => (k === 'playlistId' ? 'p1' : k === 'videoId' ? 'yt1' : null) } };
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should load youtubeId and call markAsWatched on ENDED', async () => {
    expect(component.youtubeId()).toBe('yt1');
    // simulate stateChange ENDED
    component.onStateChange({ data: 0 });
    // allow promise microtask
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(progressServiceSpy.markAsWatched).toHaveBeenCalledOnceWith('yt1');
  });
});

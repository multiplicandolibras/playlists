import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VideoComponent } from './video.component';
import { DataService } from '../../core/services/data.service';
import { PersistenceService } from '../../core/services/persistence.service';
import { ProfileService } from '../../core/services/profile.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

// Stub component for youtube-player
@Component({ selector: 'youtube-player', template: '' })
class YoutubeStub {
  @Input() videoId: string | undefined;
  @Output() stateChange = new EventEmitter<any>();
}

describe('VideoComponent', () => {
  let fixture: ComponentFixture<VideoComponent>;
  let component: VideoComponent;
  let persistenceSpy: any;

  const mockPlaylist = {
    id: 'p1',
    title: 'P1',
    modules: [
      { id: 'm1', title: 'M1', lessons: [{ id: 'v1', title: 'V1', youtubeId: 'yt1' }] }
    ]
  };

  beforeEach(async () => {
    persistenceSpy = { markAsWatched: jasmine.createSpy('markAsWatched').and.returnValue(Promise.resolve()) };

    await TestBed.configureTestingModule({
      imports: [VideoComponent, RouterTestingModule.withRoutes([])],
      declarations: [YoutubeStub],
      providers: [
        { provide: DataService, useValue: { getPlaylistById: (id: string) => of(mockPlaylist) } },
        { provide: PersistenceService, useValue: persistenceSpy },
        { provide: ProfileService, useValue: { currentProfile: { id: 1, name: 'Test' } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VideoComponent);
    component = fixture.componentInstance;
    // set route snapshot params by temporarily patching ActivatedRoute in the component's injector is complex; instead set fields directly
    (component as any).playlistId = 'p1';
    (component as any).videoId = 'v1';
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should load youtubeId and call markAsWatched on ENDED', async () => {
    expect(component.youtubeId).toBe('yt1');
    // simulate stateChange ENDED
    component.onStateChange({ data: 0 });
    // allow promise microtask
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(persistenceSpy.markAsWatched).toHaveBeenCalledOnceWith(1, 'v1');
  });
});

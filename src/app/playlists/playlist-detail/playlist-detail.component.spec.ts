import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PlaylistDetailComponent } from './playlist-detail.component';
import { DataService } from '../../core/services/data.service';
import { PersistenceService } from '../../core/services/persistence.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('PlaylistDetailComponent', () => {
  let fixture: ComponentFixture<PlaylistDetailComponent>;
  let component: PlaylistDetailComponent;

  const mockPlaylist = {
    id: 'p1',
    title: 'P1',
    modules: [
      { id: 'm1', title: 'M1', lessons: [{ id: 'l1', title: 'L1', youtubeId: 'y1' }] }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistDetailComponent, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: DataService, useValue: { getPlaylistById: (id: string) => of(mockPlaylist) } },
        { provide: PersistenceService, useValue: { getWatchedVideos: async (p: number) => ['l1'], markAsWatched: async () => {}, markAsUnwatched: async () => {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should load playlist and mark watched state', () => {
    expect(component.playlist).toBeTruthy();
    expect(component.isWatched('l1')).toBeTrue();
  });
});

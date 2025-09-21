import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PlaylistListComponent } from './playlist-list.component';
import { DataService } from '../../core/services/data.service';
import { ProfileService } from '../../core/services/profile.service';
import { PersistenceService } from '../../core/services/persistence.service';
import { of } from 'rxjs';
import { Playlist } from '../../core/models/playlist.model';
import { RouterTestingModule } from '@angular/router/testing';

describe('PlaylistListComponent', () => {
  let fixture: ComponentFixture<PlaylistListComponent>;
  let component: PlaylistListComponent;

  const mockPlaylists: Playlist[] = [
    {
      id: 'p1',
      title: 'Playlist 1',
      description: 'Desc',
      modules: [
        { id: 'm1', title: 'M1', lessons: [{ id: 'l1', title: 'L1', youtubeId: 'y1' }] }
      ]
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistListComponent, RouterTestingModule],
      providers: [
        {
          provide: DataService,
          useValue: { getPlaylists: () => of(mockPlaylists) }
        },
        {
          provide: ProfileService,
          useValue: { getActiveProfile: () => of({ id: 1, name: 'Test' }) }
        },
        {
          provide: PersistenceService,
          useValue: { getWatchedVideos: async (profileId: number) => ['l1'] }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create and display playlist', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.card mat-card-title')?.textContent).toContain('Playlist 1');
    expect(compiled.querySelector('.progress-label')?.textContent).toContain('100%');
  });
});

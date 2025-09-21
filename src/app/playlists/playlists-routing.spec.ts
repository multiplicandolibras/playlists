import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PlaylistsModule } from './playlists.module';
import { routes } from '../app.routes';

describe('Playlists routing', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), PlaylistsModule]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    router.initialNavigation();
  });

  it('should navigate to root and load playlists route', async () => {
    await router.navigateByUrl('/');
    expect(location.path()).toBe('/');
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DataService } from './data.service';
import { Playlist } from '../models/playlist.model';
import { provideHttpClient } from '@angular/common/http';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DataService
      ]
    });
    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch playlists from assets/playlists.json', () => {
    const dummyPlaylists: Playlist[] = [
      { id: '1', title: 'Playlist 1', modules: [] },
      { id: '2', title: 'Playlist 2', modules: [] },
    ];

    service.getPlaylists().subscribe(playlists => {
      expect(playlists.length).toBe(2);
      expect(playlists).toEqual(dummyPlaylists);
    });

    const req = httpMock.expectOne('assets/playlists.json');
    expect(req.request.method).toBe('GET');
    req.flush(dummyPlaylists);
  });

  it('should return a playlist by id', () => {
    const dummyPlaylists: Playlist[] = [
      { id: '1', title: 'Playlist 1', modules: [] },
      { id: '2', title: 'Playlist 2', modules: [] },
    ];

    service.getPlaylists().subscribe();

    const req = httpMock.expectOne('assets/playlists.json');
    req.flush(dummyPlaylists);

    service.getPlaylistById('2').subscribe(playlist => {
      expect(playlist).toEqual(dummyPlaylists[1]);
    });
  });

  it('should return undefined for a non-existent playlist id', () => {
    const dummyPlaylists: Playlist[] = [
      { id: '1', title: 'Playlist 1', modules: [] },
      { id: '2', title: 'Playlist 2', modules: [] },
    ];

    service.getPlaylists().subscribe();

    const req = httpMock.expectOne('assets/playlists.json');
    req.flush(dummyPlaylists);

    service.getPlaylistById('3').subscribe(playlist => {
      expect(playlist).toBeUndefined();
    });
  });

  it('should use cache on subsequent calls', () => {
    const dummyPlaylists: Playlist[] = [
      { id: '1', title: 'Playlist 1', modules: [] },
    ];

    service.getPlaylists().subscribe();

    const req = httpMock.expectOne('assets/playlists.json');
    req.flush(dummyPlaylists);

    // Second call should not trigger a new HTTP request
    service.getPlaylists().subscribe(playlists => {
      expect(playlists).toEqual(dummyPlaylists);
    });

    httpMock.expectNone('assets/playlists.json');
  });

  it('should reload data from the server on reload()', () => {
    const dummyPlaylists1: Playlist[] = [
      { id: '1', title: 'Playlist 1', modules: [] },
    ];
    const dummyPlaylists2: Playlist[] = [
      { id: '2', title: 'Playlist 2', modules: [] },
    ];

    service.getPlaylists().subscribe();

    const req1 = httpMock.expectOne('assets/playlists.json');
    req1.flush(dummyPlaylists1);

    service.reload().subscribe(playlists => {
      expect(playlists).toEqual(dummyPlaylists2);
    });

    const req2 = httpMock.expectOne('assets/playlists.json');
    expect(req2.request.method).toBe('GET');
    req2.flush(dummyPlaylists2);
  });
});

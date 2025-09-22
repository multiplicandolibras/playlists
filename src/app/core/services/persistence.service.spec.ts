import { TestBed } from '@angular/core/testing';
import { PersistenceService } from './persistence.service';

describe('PersistenceService', () => {
  let service: PersistenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersistenceService],
    });
    service = TestBed.inject(PersistenceService);
    // Mock the internal Dexie instance
    service.progress = jasmine.createSpyObj('progress', ['toArray', 'add', 'delete', 'where']);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Progress', () => {
    it('should mark a video as watched and get watched videos', async () => {
      (service.progress.toArray as jasmine.Spy).and.returnValue(Promise.resolve([{ youtubeId: 'video1' }]));
      (service.progress.add as jasmine.Spy).and.returnValue(Promise.resolve());

      await service.markAsWatched('video1');
      const watched = await service.getWatchedVideos();

      expect(service.progress.add).toHaveBeenCalledWith({ youtubeId: 'video1', watchedAt: jasmine.any(Number) });
      expect(watched.length).toBe(1);
      expect(watched[0]).toBe('video1');
    });

    it('should mark a video as unwatched', async () => {
      const firstSpy = jasmine.createSpyObj('first', ['then']);
      const whereSpy = jasmine.createSpyObj('where', ['first']);
      (service.progress.where as jasmine.Spy).and.returnValue(whereSpy);
      (whereSpy.first as jasmine.Spy).and.returnValue(Promise.resolve({ id: 1 }));
      (service.progress.delete as jasmine.Spy).and.returnValue(Promise.resolve());

      await service.markAsUnwatched('video1');

      expect(service.progress.where).toHaveBeenCalledWith({ youtubeId: 'video1' });
      expect(service.progress.delete).toHaveBeenCalledWith(1);
    });
  });
});

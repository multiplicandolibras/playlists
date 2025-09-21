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
    service.profiles = jasmine.createSpyObj('profiles', ['toArray', 'add', 'update', 'delete', 'where']);
    service.progress = jasmine.createSpyObj('progress', ['toArray', 'add', 'delete', 'where']);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Profiles', () => {
    it('should add a profile and get all profiles', async () => {
      (service.profiles.add as jasmine.Spy).and.returnValue(Promise.resolve(1));
      (service.profiles.toArray as jasmine.Spy).and.returnValue(Promise.resolve([{ id: 1, name: 'Test Profile' }]));

      await service.addProfile('Test Profile');
      const profiles = await service.getAllProfiles();

      expect(service.profiles.add).toHaveBeenCalledWith({ name: 'Test Profile' });
      expect(profiles.length).toBe(1);
      expect(profiles[0].name).toBe('Test Profile');
    });

    it('should update a profile name', async () => {
      (service.profiles.update as jasmine.Spy).and.returnValue(Promise.resolve());

      await service.updateProfileName(1, 'Updated Profile');

      expect(service.profiles.update).toHaveBeenCalledWith(1, { name: 'Updated Profile' });
    });

    it('should delete a profile and its progress', async () => {
      const whereSpy = jasmine.createSpyObj('where', ['delete']);
      (service.progress.where as jasmine.Spy).and.returnValue(whereSpy);
      (whereSpy.delete as jasmine.Spy).and.returnValue(Promise.resolve());
      (service.profiles.delete as jasmine.Spy).and.returnValue(Promise.resolve());

      await service.deleteProfile(1);

      expect(service.progress.where).toHaveBeenCalledWith({ profileId: 1 });
      expect(whereSpy.delete).toHaveBeenCalled();
      expect(service.profiles.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('Progress', () => {
    it('should mark a video as watched and get watched videos', async () => {
      const whereSpy = jasmine.createSpyObj('where', ['toArray']);
      (service.progress.where as jasmine.Spy).and.returnValue(whereSpy);
      (whereSpy.toArray as jasmine.Spy).and.returnValue(Promise.resolve([{ videoId: 'video1' }]));
      (service.progress.add as jasmine.Spy).and.returnValue(Promise.resolve());

      await service.markAsWatched(1, 'video1');
      const watched = await service.getWatchedVideos(1);

      expect(service.progress.add).toHaveBeenCalledWith({ profileId: 1, videoId: 'video1', watchedAt: jasmine.any(Number) });
      expect(watched.length).toBe(1);
      expect(watched[0]).toBe('video1');
    });

    it('should mark a video as unwatched', async () => {
      const firstSpy = jasmine.createSpyObj('first', ['then']);
      const whereSpy = jasmine.createSpyObj('where', ['first']);
      (service.progress.where as jasmine.Spy).and.returnValue(whereSpy);
      (whereSpy.first as jasmine.Spy).and.returnValue(Promise.resolve({ id: 1 }));
      (service.progress.delete as jasmine.Spy).and.returnValue(Promise.resolve());

      await service.markAsUnwatched(1, 'video1');

      expect(service.progress.where).toHaveBeenCalledWith({ profileId: 1, videoId: 'video1' });
      expect(service.progress.delete).toHaveBeenCalledWith(1);
    });
  });
});

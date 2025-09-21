import { TestBed } from '@angular/core/testing';
import { ProfileService } from './profile.service';
import { PersistenceService } from './persistence.service';
import { Profile } from '../models/profile.model';
import { of } from 'rxjs';

describe('ProfileService', () => {
  let service: ProfileService;
  let persistenceServiceMock: any;

  beforeEach(() => {
    persistenceServiceMock = {
      profiles: {
        get: jasmine.createSpy('get').and.returnValue(Promise.resolve(null)),
      },
      getAllProfiles: jasmine.createSpy('getAllProfiles').and.returnValue(Promise.resolve([])),
    };

    TestBed.configureTestingModule({
      providers: [
        ProfileService,
        { provide: PersistenceService, useValue: persistenceServiceMock }
      ]
    });
    service = TestBed.inject(ProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null as active profile initially', (done) => {
    service.getActiveProfile().subscribe(profile => {
      expect(profile).toBeNull();
      done();
    });
  });

  it('should set active profile to null when profileId is null', (done) => {
    service.setActiveProfile(null);
    service.getActiveProfile().subscribe(profile => {
      expect(profile).toBeNull();
      done();
    });
  });

  it('should set active profile when a valid profileId is provided', async () => {
    const dummyProfile: Profile = { id: 1, name: 'Test Profile' };
    persistenceServiceMock.profiles.get.and.returnValue(Promise.resolve(dummyProfile));

    await service.setActiveProfile(1);

    service.getActiveProfile().subscribe(profile => {
      expect(profile).toEqual(dummyProfile);
    });
    expect(persistenceServiceMock.profiles.get).toHaveBeenCalledWith(1);
  });

  it('should set active profile to null when an invalid profileId is provided', async () => {
    persistenceServiceMock.profiles.get.and.returnValue(Promise.resolve(undefined));

    await service.setActiveProfile(999);

    service.getActiveProfile().subscribe(profile => {
      expect(profile).toBeNull();
    });
    expect(persistenceServiceMock.profiles.get).toHaveBeenCalledWith(999);
  });

  it('should return the current profile synchronously', async () => {
    const dummyProfile: Profile = { id: 1, name: 'Test Profile' };
    persistenceServiceMock.profiles.get.and.returnValue(Promise.resolve(dummyProfile));

    await service.setActiveProfile(1);

    expect(service.currentProfile).toEqual(dummyProfile);
  });

  it('should refresh profiles by calling persistenceService.getAllProfiles', async () => {
    const dummyProfiles: Profile[] = [{ id: 1, name: 'Profile 1' }];
    persistenceServiceMock.getAllProfiles.and.returnValue(Promise.resolve(dummyProfiles));

    const profiles = await service.refreshProfiles();

    expect(profiles).toEqual(dummyProfiles);
    expect(persistenceServiceMock.getAllProfiles).toHaveBeenCalled();
  });
});

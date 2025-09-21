import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileManagerComponent } from './profile-manager.component';
import { ProfileService } from '../../../core/services/profile.service';
import { PersistenceService } from '../../../core/services/persistence.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Profile } from '../../../core/models/profile.model';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProfileManagerComponent', () => {
  let component: ProfileManagerComponent;
  let fixture: ComponentFixture<ProfileManagerComponent>;
  let profileServiceSpy: jasmine.SpyObj<ProfileService>;
  let persistenceServiceSpy: jasmine.SpyObj<PersistenceService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  const mockProfiles: Profile[] = [
    { id: 1, name: 'Profile 1' },
    { id: 2, name: 'Profile 2' },
  ];

  beforeEach(async () => {
    profileServiceSpy = jasmine.createSpyObj('ProfileService', [
      'getActiveProfile', 'setActiveProfile', 'currentProfile'
    ]);
    persistenceServiceSpy = jasmine.createSpyObj('PersistenceService', [
      'getAllProfiles', 'addProfile', 'deleteProfile', 'profiles'
    ]);
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    profileServiceSpy.getActiveProfile.and.returnValue(of(null));
    persistenceServiceSpy.getAllProfiles.and.returnValue(Promise.resolve(mockProfiles));
    persistenceServiceSpy.profiles = jasmine.createSpyObj('profiles', ['get']);

    Object.defineProperty(profileServiceSpy, 'currentProfile', {
      get: () => null,
    });

    await TestBed.configureTestingModule({
      imports: [
        ProfileManagerComponent,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: PersistenceService, useValue: persistenceServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load profiles on init', () => {
    expect(persistenceServiceSpy.getAllProfiles).toHaveBeenCalled();
    expect(component.profiles).toEqual(mockProfiles);
  });

  it('should select a profile', async () => {
    const profileToSelect = mockProfiles[0];
    if (profileToSelect.id) {
      await component.selectProfile(profileToSelect);
      expect(profileServiceSpy.setActiveProfile).toHaveBeenCalledWith(profileToSelect.id);
    }
  });

  it('should add a profile', async () => {
    component.newProfileName = 'New Profile';
    persistenceServiceSpy.addProfile.and.returnValue(Promise.resolve(3));
    await component.addProfile();
    expect(persistenceServiceSpy.addProfile).toHaveBeenCalledWith('New Profile');
    expect(component.newProfileName).toBe('');
    expect(persistenceServiceSpy.getAllProfiles).toHaveBeenCalledTimes(2); // Initial load + after add
  });

  it('should delete a profile', async () => {
    const profileToDelete = mockProfiles[0];
    Object.defineProperty(profileServiceSpy, 'currentProfile', {
      get: () => null,
    });
    if (profileToDelete.id) {
      await component.deleteProfile(profileToDelete);
      expect(persistenceServiceSpy.deleteProfile).toHaveBeenCalledWith(profileToDelete.id);
      expect(persistenceServiceSpy.getAllProfiles).toHaveBeenCalledTimes(2); // Initial load + after delete
    }
  });

  it('should set active profile to null if deleted profile is active', async () => {
    const profileToDelete = mockProfiles[0];
    Object.defineProperty(profileServiceSpy, 'currentProfile', {
      get: () => profileToDelete,
    });
    component.activeProfile = profileToDelete;
    await component.deleteProfile(profileToDelete);
    expect(profileServiceSpy.setActiveProfile).toHaveBeenCalledWith(null);
  });

  it('should not set active profile to null if deleted profile is not active', async () => {
    const profileToDelete = mockProfiles[0];
    Object.defineProperty(profileServiceSpy, 'currentProfile', {
      get: () => mockProfiles[1],
    });
    component.activeProfile = mockProfiles[1];
    await component.deleteProfile(profileToDelete);
    expect(profileServiceSpy.setActiveProfile).not.toHaveBeenCalledWith(null);
  });
});

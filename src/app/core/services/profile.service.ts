import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Profile } from '../models/profile.model';
import { PersistenceService } from './persistence.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private persistenceService = inject(PersistenceService);
  private activeProfileSubject = new BehaviorSubject<Profile | null>(null);

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    const profiles = await this.persistenceService.getAllProfiles();
    if (profiles.length === 0) {
      await this.createDefaultProfile();
    } else {
      // Optionally set the first profile as active if none is set
      if (!this.activeProfileSubject.value && profiles.length > 0) {
        await this.setActiveProfile(profiles[0].id ?? null);
      }
    }
  }

  private async createDefaultProfile(): Promise<void> {
    const defaultProfile: Profile = {
      id: Date.now(), // Simple unique ID
      name: 'usuario 1',
      progress: {}
    };
    const newProfileId = await this.persistenceService.addProfile(defaultProfile);
    await this.setActiveProfile(newProfileId);
  }

  getActiveProfile(): Observable<Profile | null> {
    return this.activeProfileSubject.asObservable();
  }

  async setActiveProfile(profileId: number | null): Promise<void> {
    if (profileId === null) {
      this.activeProfileSubject.next(null);
      return;
    }
    const profile = await this.persistenceService.profiles.get(profileId);
    this.activeProfileSubject.next(profile || null);
  }

  async refreshProfiles(): Promise<Profile[]> {
    return this.persistenceService.getAllProfiles();
  }

  get currentProfile(): Profile | null {
    return this.activeProfileSubject.value;
  }
}

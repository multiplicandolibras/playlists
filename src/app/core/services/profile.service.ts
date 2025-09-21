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

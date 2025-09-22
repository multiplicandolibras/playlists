import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../core/services/profile.service';
import { PersistenceService } from '../../../core/services/persistence.service';
import { Profile } from '../../../core/models/profile.model';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-manager',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
  ],
  templateUrl: './profile-manager.component.html',
  styleUrls: ['./profile-manager.component.scss'],
})
export class ProfileManagerComponent {
  private profileService = inject(ProfileService);
  private persistenceService = inject(PersistenceService);
  private dialog = inject(MatDialog);

  profiles: Profile[] = [];
  activeProfile: Profile | null = null;
  newProfileName = '';

  constructor() {
    this.loadProfiles();
    this.profileService.getActiveProfile().subscribe((profile) => {
      this.activeProfile = profile;
    });
  }

  async loadProfiles(): Promise<void> {
    this.profiles = await this.persistenceService.getAllProfiles();
  }

  async selectProfile(profile: Profile): Promise<void> {
    await this.profileService.setActiveProfile(profile.id!);
  }

  async addProfile(): Promise<void> {
    if (this.newProfileName.trim()) {
      const newProfile: Profile = {
        name: this.newProfileName.trim(),
        progress: {}
      };
      const newProfileId = await this.persistenceService.addProfile(newProfile);
      await this.profileService.setActiveProfile(newProfileId);
      this.newProfileName = '';
      await this.loadProfiles();
    }
  }

  async deleteProfile(profile: Profile): Promise<void> {
    if (profile.id === this.activeProfile?.id) {
      await this.profileService.setActiveProfile(null);
    }
    await this.persistenceService.deleteProfile(profile.id!);
    await this.loadProfiles();
  }

  async editProfile(profile: Profile): Promise<void> {
    // TODO: Implement dialog for editing profile name
    console.log('Edit profile', profile);
  }
}

import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Profile } from '../models/profile.model';
import { Progress } from '../models/progress.model';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService extends Dexie {
  profiles: Dexie.Table<Profile, number>;
  progress: Dexie.Table<Progress, number>;

  constructor() {
    super('PlaylistsDB');
    this.version(1).stores({
      profiles: '++id, name',
      progress: '++id, profileId, videoId, watchedAt'
    });
    this.profiles = this.table('profiles');
    this.progress = this.table('progress');
  }

  async getAllProfiles(): Promise<Profile[]> {
    return this.profiles.toArray();
  }

  async addProfile(name: string): Promise<number> {
    return this.profiles.add({ name });
  }

  async updateProfileName(profileId: number, newName: string): Promise<void> {
    await this.profiles.update(profileId, { name: newName });
  }

  async deleteProfile(profileId: number): Promise<void> {
    await this.progress.where({ profileId }).delete();
    await this.profiles.delete(profileId);
  }

  async getWatchedVideos(profileId: number): Promise<string[]> {
    const watchedItems = await this.progress.where({ profileId }).toArray();
    return watchedItems.map(item => item.videoId);
  }

  async markAsWatched(profileId: number, videoId: string): Promise<void> {
    await this.progress.add({ profileId, videoId, watchedAt: Date.now() });
  }

  async markAsUnwatched(profileId: number, videoId: string): Promise<void> {
    const record = await this.progress.where({ profileId, videoId }).first();
    if (record) {
      await this.progress.delete(record.id!);
    }
  }
}

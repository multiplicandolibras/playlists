import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Progress } from '../models/progress.model';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService extends Dexie {
  progress: Dexie.Table<Progress, number>;

  constructor() {
    super('PlaylistsDB');
    this.version(3).stores({
      progress: '++id, youtubeId, watchedAt'
    }).upgrade(tx => {
      return tx.table('progress').toCollection().modify(p => {
        p.youtubeId = p.videoId;
        delete p.videoId;
      });
    });
    this.version(2).stores({
      progress: '++id, videoId, watchedAt'
    }).upgrade(tx => {
      return tx.table('progress').toCollection().modify(p => {
        delete p.profileId;
      });
    });
    this.version(1).stores({
      profiles: '++id, name',
      progress: '++id, profileId, videoId, watchedAt'
    });
    this.progress = this.table('progress');
  }

  async getWatchedVideos(): Promise<string[]> {
    const watchedItems = await this.progress.toArray();
    return watchedItems.map(item => item.youtubeId);
  }

  async markAsWatched(youtubeId: string): Promise<void> {
    await this.progress.add({ youtubeId, watchedAt: Date.now() });
  }

  async markAsUnwatched(youtubeId: string): Promise<void> {
    const record = await this.progress.where({ youtubeId }).first();
    if (record) {
      await this.progress.delete(record.id!);
    }
  }
}

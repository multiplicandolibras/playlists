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
    this.version(2).stores({
      progress: '++id, videoId, watchedAt'
    }).upgrade(tx => {
      return tx.table('progress').toCollection().modify(p => {
        delete p.profileId;
      });
    });
    this.progress = this.table('progress');
  }

  async getWatchedVideos(): Promise<string[]> {
    const watchedItems = await this.progress.toArray();
    return watchedItems.map(item => item.videoId);
  }

  async markAsWatched(videoId: string): Promise<void> {
    await this.progress.add({ videoId, watchedAt: Date.now() });
  }

  async markAsUnwatched(videoId: string): Promise<void> {
    const record = await this.progress.where({ videoId }).first();
    if (record) {
      await this.progress.delete(record.id!);
    }
  }
}
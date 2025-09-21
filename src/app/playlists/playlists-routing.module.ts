import { Routes } from '@angular/router';
import { PlaylistListComponent } from './playlist-list/playlist-list.component';
import { PlaylistDetailComponent } from './playlist-detail/playlist-detail.component';
import { VideoComponent } from './video/video.component';

export const playlistsRoutes: Routes = [
  { path: '', component: PlaylistListComponent },
  { path: 'playlists/:id', component: PlaylistDetailComponent },
  { path: 'playlists/:playlistId/videos/:videoId', component: VideoComponent }
];

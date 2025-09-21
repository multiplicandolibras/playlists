import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { playlistsRoutes } from './playlists-routing.module';

@NgModule({
  imports: [RouterModule.forChild(playlistsRoutes)],
  exports: [RouterModule]
})
export class PlaylistsModule {}

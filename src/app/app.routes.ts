import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', loadChildren: () => import('./playlists/playlists.module').then(m => m.PlaylistsModule) },
	{ path: '**', redirectTo: '' }
];
import { Routes } from '@angular/router';
import { ProfileManagerComponent } from './shared/components/profile-manager/profile-manager.component';

export const routes: Routes = [
	{ path: '', loadChildren: () => import('./playlists/playlists.module').then(m => m.PlaylistsModule) },
	{ path: 'profile-manager', component: ProfileManagerComponent },
	{ path: '**', redirectTo: '' }
];

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProfileService } from '../../../core/services/profile.service';
import { Profile } from '../../../core/models/profile.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  currentProfile: Profile | null = null;

  constructor(private profileService: ProfileService, private router: Router) {}

  ngOnInit(): void {
    this.profileService.getActiveProfile().subscribe(profile => {
      this.currentProfile = profile;
    });
  }

  switchProfile(): void {
    this.router.navigate(['/profile-manager']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ToolbarComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
}

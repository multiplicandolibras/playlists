import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `\n    <main>\n      <h1>Hello, {{ title() }}</h1>\n      <router-outlet></router-outlet>\n    </main>\n  `,
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('playlist-app');
}

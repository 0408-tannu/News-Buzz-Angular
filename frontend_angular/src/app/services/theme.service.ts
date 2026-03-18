import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  mode = signal<'light' | 'dark'>(
    (localStorage.getItem('mode') as 'light' | 'dark') || 'light'
  );

  constructor() {
    effect(() => {
      const m = this.mode();
      localStorage.setItem('mode', m);
      document.body.classList.toggle('dark-theme', m === 'dark');
      document.body.classList.toggle('light-theme', m === 'light');
    });
  }

  toggleTheme(): void {
    this.mode.set(this.mode() === 'light' ? 'dark' : 'light');
  }

  isDark(): boolean {
    return this.mode() === 'dark';
  }
}

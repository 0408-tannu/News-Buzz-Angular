import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  title: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    MatButtonModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() open = true;
  @Output() openChange = new EventEmitter<boolean>();

  theme = inject(ThemeService);
  auth = inject(AuthService);
  router = inject(Router);

  navItems: NavItem[] = [
    { title: 'Home', icon: 'home', path: '/' },
    { title: 'Feed', icon: 'article', path: '/myfeed' },
    { title: 'Following', icon: 'person_add', path: '/providers/following' },
    { title: 'Bookmark', icon: 'bookmark', path: '/bookmark' },
    { title: 'History', icon: 'history', path: '/history' },
  ];

  toggleDrawer(): void {
    this.open = !this.open;
    this.openChange.emit(this.open);
  }

  navigate(path: string): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate([path]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  isActive(path: string): boolean {
    return this.router.url.split('?')[0] === path;
  }

  toggleTheme(): void {
    this.theme.toggleTheme();
  }

  logout(): void {
    this.auth.logout();
  }
}

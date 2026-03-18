import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  sidebarOpen = signal(false);
  currentPath = signal('');

  private authRoutes = ['/login', '/signup'];
  private hideNavRoutes = ['/login', '/signup'];

  constructor(
    public theme: ThemeService,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.currentPath.set(e.urlAfterRedirects.split('?')[0]);
        window.scrollTo(0, 0);
      });
  }

  get isAuthRoute(): boolean {
    return this.authRoutes.includes(this.currentPath());
  }

  get showNavSidebar(): boolean {
    return !this.hideNavRoutes.includes(this.currentPath()) &&
           this.auth.isLoggedIn();
  }

  get showNavbar(): boolean {
    return !this.hideNavRoutes.includes(this.currentPath());
  }

  get mainMarginLeft(): string {
    if (!this.showNavSidebar) return '0';
    return this.sidebarOpen() ? '220px' : '64px';
  }
}

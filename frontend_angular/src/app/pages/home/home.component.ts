import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, NewsCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  articles: any[] = [];
  filteredArticles: any[] = [];
  searchQuery = '';
  loading = true;
  error = false;
  isLoggedIn = false;
  displayCount = 10;
  loadingMore = false;

  constructor(
    private api: ApiService,
    public auth: AuthService,
    public theme: ThemeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.fetchArticles();
  }

  fetchArticles(): void {
    this.loading = true;
    this.error = false;

    this.api.get<any>('/api/algorithms/top_stories').subscribe({
      next: (res) => {
        if (res?.caught) {
          this.router.navigate(['/login']);
          return;
        }
        if (res?.success === false && !res?.articles) {
          this.error = true;
          this.loading = false;
          return;
        }
        if (res?.articles) {
          this.articles = res.articles;
        } else if (Array.isArray(res)) {
          this.articles = res;
        } else {
          this.articles = [];
        }
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredArticles = [...this.articles];
    } else {
      this.filteredArticles = this.articles.filter(a =>
        a.title?.toLowerCase().includes(query)
      );
    }
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  get visibleArticles(): any[] {
    if (!this.isLoggedIn) {
      return this.filteredArticles.slice(0, 6);
    }
    return this.filteredArticles.slice(0, this.displayCount);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.isLoggedIn || this.loadingMore) return;

    const scrollPos = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight * 0.75;

    if (scrollPos >= threshold && this.displayCount < this.filteredArticles.length) {
      this.loadingMore = true;
      this.displayCount += 10;
      setTimeout(() => {
        this.loadingMore = false;
      }, 300);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}

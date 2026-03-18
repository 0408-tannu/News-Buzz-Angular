import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FeedCardComponent } from '../../components/feed-card/feed-card.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-my-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, FeedCardComponent],
  templateUrl: './my-feed.component.html',
  styleUrls: ['./my-feed.component.scss']
})
export class MyFeedComponent implements OnInit {
  articles: any[] = [];
  filteredArticles: any[] = [];
  searchQuery = '';
  loading = true;
  loadingMore = false;
  error = false;
  pageIndex = 0;
  hasMore = true;

  constructor(
    private api: ApiService,
    public auth: AuthService,
    public theme: ThemeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadPage();
  }

  private getUrlForPage(index: number): string {
    // text/0..3 then topic/0..1
    if (index <= 3) {
      return `/api/myfeed/getmyfeed/text/${index}`;
    } else if (index <= 5) {
      return `/api/myfeed/getmyfeed/topic/${index - 4}`;
    } else {
      return `/api/myfeed/getmyfeed/text/${index}`;
    }
  }

  loadPage(): void {
    if (!this.hasMore) return;

    if (this.pageIndex === 0) {
      this.loading = true;
    } else {
      this.loadingMore = true;
    }
    this.error = false;

    const url = this.getUrlForPage(this.pageIndex);

    this.api.get<any>(url).subscribe({
      next: (res) => {
        if (res?.caught) {
          this.router.navigate(['/login']);
          return;
        }
        if (res?.success === false && !res?.partialArticles && !res?.articles) {
          this.error = true;
          this.loading = false;
          this.loadingMore = false;
          return;
        }

        let newArticles: any[] = [];
        if (res?.partialArticles) {
          newArticles = res.partialArticles;
        } else if (res?.articles) {
          newArticles = res.articles;
        } else if (Array.isArray(res)) {
          newArticles = res;
        }

        if (newArticles.length === 0) {
          this.hasMore = false;
        } else {
          this.articles = [...this.articles, ...newArticles];
          this.pageIndex++;
        }

        this.applyFilter();
        this.loading = false;
        this.loadingMore = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.loadingMore = false;
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

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.loadingMore || this.loading || !this.hasMore) return;

    const scrollPos = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight * 0.75;

    if (scrollPos >= threshold) {
      this.loadPage();
    }
  }
}

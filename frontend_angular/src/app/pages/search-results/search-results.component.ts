import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { NewsCardComponent } from '../../components/news-card/news-card.component';

interface SearchResult {
  title: string;
  link: string;
  time?: string;
  providerImg?: string;
  providerName?: string;
  someText?: string;
}

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, NewsCardComponent],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  theme = inject(ThemeService);

  results: SearchResult[] = [];
  isLoading = true;
  loadingMore = false;
  query = '';
  searchQuery = '';
  currentPage = 1;
  hasMore = true;

  // Store current search params for pagination
  private currentParams = { q: '', site: '', tbs: '', gl: '', location: '' };

  ngOnInit(): void {
    this.auth.checkAuth();
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      this.currentParams = {
        q: params['q'] || '',
        site: params['site'] || '',
        tbs: params['tbs'] || '',
        gl: params['gl'] || '',
        location: params['location'] || '',
      };
      // Reset on new search
      this.results = [];
      this.currentPage = 1;
      this.hasMore = true;
      this.fetchResults(this.currentPage);
    });
  }

  fetchResults(page: number): void {
    const { q, site, tbs, gl, location } = this.currentParams;
    if (!q && !gl && !site) {
      this.isLoading = false;
      return;
    }

    if (page === 1) {
      this.isLoading = true;
    } else {
      this.loadingMore = true;
    }

    const params: string[] = [];
    if (q) params.push(`q=${encodeURIComponent(q)}`);
    if (site) params.push(`site=${encodeURIComponent(site)}`);
    if (tbs) params.push(`tbs=${encodeURIComponent(tbs)}`);
    if (gl) params.push(`gl=${encodeURIComponent(gl)}`);
    if (location) params.push(`location=${encodeURIComponent(location)}`);

    const url = `/api/search/${page}?${params.join('&')}`;

    this.api.get<any>(url).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.loadingMore = false;
        if (res?.caught) return;

        let newArticles: SearchResult[] = [];
        if (res?.articles) {
          newArticles = res.articles;
        } else if (res?.results) {
          newArticles = res.results;
        } else if (Array.isArray(res)) {
          newArticles = res;
        }

        if (newArticles.length === 0) {
          this.hasMore = false;
        } else {
          this.results = [...this.results, ...newArticles];
          this.currentPage++;
        }
      },
      error: () => {
        this.isLoading = false;
        this.loadingMore = false;
      }
    });
  }

  get filteredResults(): SearchResult[] {
    if (!this.searchQuery.trim()) return this.results;
    const q = this.searchQuery.toLowerCase();
    return this.results.filter(r =>
      r.title.toLowerCase().includes(q) ||
      (r.providerName && r.providerName.toLowerCase().includes(q)) ||
      (r.someText && r.someText.toLowerCase().includes(q))
    );
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.loadingMore || this.isLoading || !this.hasMore) return;
    const scrollPos = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight * 0.75;
    if (scrollPos >= threshold) {
      this.fetchResults(this.currentPage);
    }
  }
}

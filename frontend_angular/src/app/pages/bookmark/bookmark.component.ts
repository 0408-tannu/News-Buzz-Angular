import { Component, OnInit, HostListener, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { BookmarkCardComponent } from '../../components/bookmark-card/bookmark-card.component';

interface Bookmark {
  title: string;
  link: string;
  providerImg?: string;
  providerName?: string;
  imgURL?: string;
  someText?: string;
}

@Component({
  selector: 'app-bookmark',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    BookmarkCardComponent,
  ],
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.scss'],
})
export class BookmarkComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  theme = inject(ThemeService);

  bookmarks: Bookmark[] = [];
  searchQuery = '';
  isLoading = true;
  hasError = false;
  displayCount = 15;

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.api.get<any>('/api/userdo/bookmark').subscribe({
      next: res => {
        this.isLoading = false;
        if (res?.caught) {
          this.router.navigate(['/login']);
          return;
        }
        if (res?.bookmarks) {
          this.bookmarks = res.bookmarks;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      },
    });
  }

  get filteredBookmarks(): Bookmark[] {
    const all = this.searchQuery.trim()
      ? this.bookmarks.filter(b =>
          b.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (b.providerName && b.providerName.toLowerCase().includes(this.searchQuery.toLowerCase()))
        )
      : this.bookmarks;
    return all.slice(0, this.displayCount);
  }

  get hasMore(): boolean {
    const total = this.searchQuery.trim()
      ? this.bookmarks.filter(b =>
          b.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (b.providerName && b.providerName.toLowerCase().includes(this.searchQuery.toLowerCase()))
        ).length
      : this.bookmarks.length;
    return this.displayCount < total;
  }

  onBookmarkRemoved(bookmark: Bookmark): void {
    this.bookmarks = this.bookmarks.filter(b => b.title !== bookmark.title || b.link !== bookmark.link);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.isLoading || !this.hasMore) return;
    const scrollPos = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight * 0.75;
    if (scrollPos >= threshold) {
      this.displayCount += 15;
    }
  }
}

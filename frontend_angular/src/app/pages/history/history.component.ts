import { Component, OnInit, HostListener, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { HistoryCardComponent } from '../../components/history-card/history-card.component';

interface HistoryItem {
  title: string;
  link: string;
  time?: string;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatSnackBarModule, HistoryCardComponent],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private snackBar = inject(MatSnackBar);
  theme = inject(ThemeService);

  private toast(message: string): void {
    this.snackBar.open(message, '', { duration: 2500, horizontalPosition: 'center', verticalPosition: 'bottom' });
  }

  historyItems: HistoryItem[] = [];
  searchQuery = '';
  isLoading = true;
  displayCount = 10;

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchHistory();
  }

  fetchHistory(): void {
    this.isLoading = true;
    this.api.get<any>('/api/history/get').subscribe(res => {
      this.isLoading = false;
      if (res?.caught) {
        this.router.navigate(['/login']);
        return;
      }
      if (res?.data) {
        this.historyItems = res.data;
      } else if (res?.history) {
        this.historyItems = res.history;
      }
      this.cdr.detectChanges();
    });
  }

  clearAll(): void {
    this.api.get<any>('/api/history/removeallhistory').subscribe(res => {
      if (res?.success !== false) {
        this.historyItems = [];
        this.toast(res?.message || 'History cleared successfully');
      } else {
        this.toast(res?.message || 'Error clearing history');
      }
    });
  }

  get filteredHistory(): HistoryItem[] {
    const all = this.searchQuery.trim()
      ? this.historyItems.filter(item => item.title.toLowerCase().includes(this.searchQuery.toLowerCase()))
      : this.historyItems;
    return all.slice(0, this.displayCount);
  }

  get hasMore(): boolean {
    const total = this.searchQuery.trim()
      ? this.historyItems.filter(item => item.title.toLowerCase().includes(this.searchQuery.toLowerCase())).length
      : this.historyItems.length;
    return this.displayCount < total;
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.isLoading || !this.hasMore) return;
    const scrollPos = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight * 0.75;
    if (scrollPos >= threshold) {
      this.displayCount += 10;
    }
  }

  onItemRemoved(link: string): void {
    this.historyItems = this.historyItems.filter(item => item.link !== link);
  }
}

import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

interface Provider {
  name: string;
  baseURL: string;
  logo?: string;
  isFollowed?: boolean;
}

@Component({
  selector: 'app-following',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss'],
})
export class FollowingComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  theme = inject(ThemeService);

  allProviders: Provider[] = [];
  followingProviders: Provider[] = [];
  searchQuery = '';
  isLoading = true;
  activeTab: 'following' | 'all' = 'following';

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchFollowing();
  }

  fetchFollowing(): void {
    this.isLoading = true;
    this.api.get<any>('/api/provider/get_following_providers').subscribe(res => {
      this.isLoading = false;
      if (res?.caught) {
        this.router.navigate(['/login']);
        return;
      }
      if (res?.providers) {
        this.followingProviders = res.providers.map((p: Provider) => ({ ...p, isFollowed: true }));
      }
      this.cdr.detectChanges();
    });
  }

  fetchAll(): void {
    this.isLoading = true;
    this.api.get<any>('/api/provider/get_all_providers').subscribe(res => {
      this.isLoading = false;
      if (res?.providers) {
        this.allProviders = res.providers;
        this.checkFollowingStatus();
      }
      this.cdr.detectChanges();
    });
  }

  switchTab(tab: 'following' | 'all'): void {
    this.activeTab = tab;
    this.searchQuery = '';
    if (tab === 'all' && this.allProviders.length === 0) {
      this.fetchAll();
    }
  }

  private checkFollowingStatus(): void {
    for (const provider of this.allProviders) {
      this.api.post<any>('/api/userdo/isfollowed', { baseURL: provider.baseURL }).subscribe(res => {
        provider.isFollowed = !!(res?.isFollowing);
      });
    }
  }

  toggleFollow(provider: Provider, event: Event): void {
    event.stopPropagation();
    if (!this.auth.isLoggedIn()) return;

    if (provider.isFollowed) {
      this.api.post('/api/userdo/unfollow', { baseURL: provider.baseURL }).subscribe(() => {
        provider.isFollowed = false;
        if (this.activeTab === 'following') {
          this.followingProviders = this.followingProviders.filter(p => p.baseURL !== provider.baseURL);
        }
      });
    } else {
      this.api.post('/api/userdo/follow', { baseURL: provider.baseURL }).subscribe(() => {
        provider.isFollowed = true;
      });
    }
  }

  get displayedProviders(): Provider[] {
    const list = this.activeTab === 'following' ? this.followingProviders : this.allProviders;
    if (!this.searchQuery.trim()) return list;
    const q = this.searchQuery.toLowerCase();
    return list.filter(p => p.name.toLowerCase().includes(q) || p.baseURL.toLowerCase().includes(q));
  }
}

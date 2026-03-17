import { Component, Input, Output, EventEmitter, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-news-provider-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './news-provider-card.component.html',
  styleUrls: ['./news-provider-card.component.scss'],
})
export class NewsProviderCardComponent implements OnInit {
  @Input() name = '';
  @Input() logoUrl = '';
  @Input() baseURL = '';
  @Input() providerType: 'all' | 'following' = 'all';
  @Output() unfollowed = new EventEmitter<string>();

  theme = inject(ThemeService);
  private api = inject(ApiService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  isFollowing = false;
  isMuted = false;
  isShrinking = false;
  menuOpen = false;

  private toast(message: string): void {
    this.snackBar.open(message, '', { duration: 2500, horizontalPosition: 'center', verticalPosition: 'bottom' });
  }

  ngOnInit(): void {
    if (this.providerType === 'following') {
      this.isFollowing = true;
    } else {
      this.api.post<any>('/api/userdo/isfollowed', { baseURL: this.baseURL }).subscribe({
        next: res => {
          if (res?.success) {
            this.isFollowing = res.isFollowing;
            this.cdr.detectChanges();
          } else if (res?.caught) {
            this.router.navigate(['/login']);
          }
        },
      });
    }

    this.api.post<any>('/api/mute/get', { baseURL: this.baseURL }).subscribe({
      next: res => {
        if (res?.success) {
          this.isMuted = res.isMuted;
          this.cdr.detectChanges();
        }
      },
    });
  }

  toggleFollow(): void {
    const wasFollowing = this.isFollowing;
    const endpoint = wasFollowing ? '/api/userdo/unfollow' : '/api/userdo/follow';
    this.api.post<any>(endpoint, { baseURL: this.baseURL }).subscribe({
      next: res => {
        if (res?.success) {
          this.isFollowing = !wasFollowing;
          this.toast(wasFollowing ? 'Unfollowed successfully!' : 'Followed successfully!');
          if (wasFollowing && this.providerType === 'following') {
            this.isShrinking = true;
            setTimeout(() => this.unfollowed.emit(this.baseURL), 400);
          }
          this.cdr.detectChanges();
        } else if (res?.caught) {
          this.router.navigate(['/login']);
        } else {
          this.toast('Something went wrong, please try again later.');
        }
      },
      error: () => {
        this.toast('An error occurred. Please try again.');
      },
    });
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  seeArticles(): void {
    const stripped = this.baseURL.replace(/^https?:\/\//, '');
    window.open(`${window.location.origin}/search?site=${stripped}`, '_blank');
    this.closeMenu();
  }

  visitWebsite(): void {
    window.open(this.baseURL, '_blank');
    this.closeMenu();
  }

  toggleMute(): void {
    const wasMuted = this.isMuted;
    const endpoint = wasMuted ? '/api/mute/remove' : '/api/mute/add';
    this.api.post<any>(endpoint, { baseURL: this.baseURL }).subscribe({
      next: res => {
        if (res?.success) {
          this.isMuted = !wasMuted;
          this.toast(wasMuted ? 'Unmuted successfully!' : 'Muted successfully!');
          this.cdr.detectChanges();
        } else if (res?.caught) {
          this.router.navigate(['/login']);
        } else {
          this.toast('Something went wrong, please try again later.');
        }
      },
      error: () => {
        this.toast('An error occurred. Please try again.');
      },
    });
    this.closeMenu();
  }

  onOverlayClick(): void {
    this.closeMenu();
  }
}

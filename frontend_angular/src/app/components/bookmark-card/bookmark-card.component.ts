import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { ShareDialogComponent } from '../share-dialog/share-dialog.component';

@Component({
  selector: 'app-bookmark-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatSnackBarModule, ShareDialogComponent],
  templateUrl: './bookmark-card.component.html',
  styleUrls: ['./bookmark-card.component.scss'],
})
export class BookmarkCardComponent implements OnInit {
  @Input() title = '';
  @Input() link = '';
  @Input() providerImg = '';
  @Input() providerName = '';
  @Input() imgURL = '';
  @Input() someText = '';
  @Output() removed = new EventEmitter<void>();

  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  theme = inject(ThemeService);

  liked = false;
  hovered = false;
  isRemoving = false;
  showShareDialog = false;

  private toast(message: string): void {
    this.snackBar.open(message, '', {
      duration: 2500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  ngOnInit(): void {
    if (!this.auth.isLoggedIn() || !this.title) return;

    this.api.post<any>('/api/userdo/isLiked', { title: this.title }).subscribe(res => {
      if (res?.success) this.liked = res.liked;
      if (res?.caught) this.router.navigate(['/login']);
    });
  }

  openLink(): void {
    if (this.link) {
      window.open(this.link, '_blank');
    }
  }

  deleteBookmark(event: Event): void {
    event.stopPropagation();
    this.isRemoving = true;

    this.api.post<any>('/api/userdo/deleteBookmark', { title: this.title, link: this.link }).subscribe({
      next: res => {
        if (res?.caught) {
          this.router.navigate(['/login']);
          this.isRemoving = false;
          return;
        }
        if (res?.success) {
          this.toast('Bookmark removed successfully!');
          setTimeout(() => this.removed.emit(), 500);
        } else {
          this.toast('Error removing bookmark');
          this.isRemoving = false;
        }
      },
      error: () => {
        this.toast('Error removing bookmark');
        this.isRemoving = false;
      },
    });
  }

  toggleLike(event: Event): void {
    event.stopPropagation();
    if (!this.auth.isLoggedIn()) return;

    const details = { title: this.title };

    if (this.liked) {
      this.api.post<any>('/api/userdo/deleteLike', details).subscribe(res => {
        if (res?.caught) { this.router.navigate(['/login']); return; }
        this.liked = false;
        this.toast('Like removed successfully!');
      });
    } else {
      this.api.post<any>('/api/userdo/addlike', details).subscribe(res => {
        if (res?.caught) { this.router.navigate(['/login']); return; }
        this.liked = true;
        this.toast('Like added successfully!');
      });
    }
  }

  openShareDialog(event: Event): void {
    event.stopPropagation();
    this.showShareDialog = true;
  }
}

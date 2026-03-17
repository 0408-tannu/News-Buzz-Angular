import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { ShareDialogComponent } from '../share-dialog/share-dialog.component';
import { CommentsMenuComponent } from '../comments-menu/comments-menu.component';

@Component({
  selector: 'app-feed-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatSnackBarModule, ShareDialogComponent, CommentsMenuComponent],
  templateUrl: './feed-card.component.html',
  styleUrls: ['./feed-card.component.scss']
})
export class FeedCardComponent implements OnInit {
  @Input() title = '';
  @Input() link = '';
  @Input() time = '';
  @Input() providerImg = '';
  @Input() providerName = '';
  @Input() someText = '';
  @Input() imgURL = '';

  liked = false;
  bookmarked = false;
  likeCount = 0;
  commentCount = 0;
  hovered = false;
  showShareDialog = false;
  showComments = false;

  constructor(
    private api: ApiService,
    public auth: AuthService,
    public theme: ThemeService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  private toast(message: string): void {
    this.snackBar.open(message, '', { duration: 2500, horizontalPosition: 'center', verticalPosition: 'bottom' });
  }

  ngOnInit(): void {
    if (!this.auth.isLoggedIn() || !this.title) return;

    this.api.post<any>('/api/userdo/isbookmarked', { title: this.title, link: this.link }).subscribe(res => {
      if (res?.success) this.bookmarked = res.bookmarked;
      if (res?.caught) this.router.navigate(['/login']);
    });

    this.api.post<any>('/api/userdo/isLiked', { title: this.title }).subscribe(res => {
      if (res?.success) this.liked = res.liked;
      if (res?.caught) this.router.navigate(['/login']);
    });

    this.api.post<any>('/api/userdo/numLikes', { title: this.title }).subscribe(res => {
      if (res?.success) this.likeCount = res.numLikes || 0;
      if (res?.caught) this.router.navigate(['/login']);
    });

    this.api.post<any>('/api/userdo/numComments', { articleURL: this.link }).subscribe(res => {
      if (res?.success) this.commentCount = res.numComments || 0;
      if (res?.caught) this.router.navigate(['/login']);
    });
  }

  onCardClick(): void {
    if (this.link) {
      this.api.post('/api/history/add', { title: this.title, link: this.link }).subscribe();
      window.open(this.link, '_blank');
    }
  }

  toggleLike(event: Event): void {
    event.stopPropagation();
    if (!this.auth.isLoggedIn()) return;

    const details = { title: this.title };

    if (this.liked) {
      this.api.post('/api/userdo/deleteLike', details).subscribe(res => {
        if ((res as any)?.caught) { this.router.navigate(['/login']); return; }
        this.liked = false;
        this.likeCount = Math.max(0, this.likeCount - 1);
        this.toast('Like removed successfully!');
      });
    } else {
      this.api.post('/api/userdo/addlike', details).subscribe(res => {
        if ((res as any)?.caught) { this.router.navigate(['/login']); return; }
        this.liked = true;
        this.likeCount++;
        this.toast('Like added successfully!');
      });
    }
  }

  toggleBookmark(event: Event): void {
    event.stopPropagation();
    if (!this.auth.isLoggedIn()) return;

    const details = {
      title: this.title,
      link: this.link,
      imgURL: this.imgURL,
      providerName: this.providerName,
      providerImg: this.providerImg,
      time: this.time,
      someText: this.someText,
    };

    if (this.bookmarked) {
      this.api.post('/api/userdo/deleteBookmark', details).subscribe(res => {
        if ((res as any)?.caught) { this.router.navigate(['/login']); return; }
        this.bookmarked = false;
        this.toast('Bookmark removed successfully!');
      });
    } else {
      this.api.post('/api/userdo/addBookmark', details).subscribe(res => {
        if ((res as any)?.caught) { this.router.navigate(['/login']); return; }
        this.bookmarked = true;
        this.toast('Bookmark added successfully!');
      });
    }
  }

  openShareDialog(event: Event): void {
    event.stopPropagation();
    this.showShareDialog = true;
  }

  openComments(event: Event): void {
    event.stopPropagation();
    if (!this.auth.isLoggedIn()) return;
    this.showComments = true;
  }

  onCommentCountChanged(count: number): void {
    this.commentCount = count;
  }
}

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ThemeService } from '../../services/theme.service';

interface Comment {
  commentId: number;
  username: string;
  comment: string;
  timestamp?: string;
}

@Component({
  selector: 'app-comments-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatSnackBarModule],
  templateUrl: './comments-menu.component.html',
  styleUrls: ['./comments-menu.component.scss']
})
export class CommentsMenuComponent implements OnInit, OnChanges {
  @Input() articleURL = '';
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() commentCountChanged = new EventEmitter<number>();

  comments: Comment[] = [];
  loggedUserName = '';
  newComment = '';
  isLoading = false;

  private snackBar: MatSnackBar;

  constructor(
    private api: ApiService,
    public theme: ThemeService,
    private router: Router,
    snackBar: MatSnackBar
  ) {
    this.snackBar = snackBar;
  }

  private toast(message: string): void {
    this.snackBar.open(message, '', { duration: 2500, horizontalPosition: 'center', verticalPosition: 'bottom' });
  }

  ngOnInit(): void {
    if (this.isOpen) this.fetchComments();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.fetchComments();
    }
  }

  fetchComments(): void {
    this.isLoading = true;
    this.api.post<any>('/api/userdo/getComments', { articleURL: this.articleURL }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res?.caught) { this.router.navigate(['/login']); return; }
        if (res?.success) {
          this.comments = res.comments || [];
          this.loggedUserName = res.loggedUserName || '';
        }
      },
      error: () => { this.isLoading = false; }
    });
  }

  addComment(): void {
    if (!this.newComment.trim()) return;

    this.api.post<any>('/api/userdo/addComment', {
      articleURL: this.articleURL,
      comment: this.newComment
    }).subscribe({
      next: (res) => {
        if (res?.caught) { this.router.navigate(['/login']); return; }
        if (res?.success) {
          this.comments.push({
            username: res.username,
            comment: this.newComment,
            commentId: this.comments.length + 1,
            timestamp: new Date().toISOString()
          });
          this.newComment = '';
          this.updateCount();
          this.toast('Comment added successfully');
        }
      }
    });
  }

  deleteComment(commentId: number): void {
    this.api.post<any>('/api/userdo/deleteComment', {
      articleURL: this.articleURL,
      commentId
    }).subscribe({
      next: (res) => {
        if (res?.caught) { this.router.navigate(['/login']); return; }
        if (res?.success) {
          this.comments = this.comments.filter(c => c.commentId !== commentId);
          this.updateCount();
          this.toast('Comment deleted successfully');
        }
      }
    });
  }

  private updateCount(): void {
    this.api.post<any>('/api/userdo/numComments', { articleURL: this.articleURL }).subscribe(res => {
      if (res?.success) {
        this.commentCountChanged.emit(res.numComments || 0);
      }
    });
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onOverlayClick(event: Event): void {
    if ((event.target as HTMLElement).classList.contains('comments-overlay')) {
      this.closed.emit();
    }
  }
}

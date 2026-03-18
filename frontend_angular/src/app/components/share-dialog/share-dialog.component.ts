import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-share-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatSnackBarModule],
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.scss']
})
export class ShareDialogComponent {
  @Input() link = '';
  @Output() closed = new EventEmitter<void>();

  copied = false;

  constructor(public theme: ThemeService, private snackBar: MatSnackBar) {}

  private toast(message: string): void {
    this.snackBar.open(message, '', { duration: 2500, horizontalPosition: 'center', verticalPosition: 'bottom' });
  }

  share(platform: string): void {
    switch (platform) {
      case 'x':
        window.open(`https://x.com/intent/post?url=${encodeURIComponent(this.link)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.link)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(this.link);
        this.copied = true;
        this.toast('Link copied to clipboard');
        setTimeout(() => {
          this.copied = false;
          this.closed.emit();
        }, 1000);
        return;
    }
    this.closed.emit();
  }

  onOverlayClick(event: Event): void {
    if ((event.target as HTMLElement).classList.contains('share-overlay')) {
      this.closed.emit();
    }
  }
}

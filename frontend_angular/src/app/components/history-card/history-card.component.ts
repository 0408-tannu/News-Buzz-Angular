import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-history-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule, MatSnackBarModule],
  templateUrl: './history-card.component.html',
  styleUrls: ['./history-card.component.scss'],
})
export class HistoryCardComponent {
  @Input() title = '';
  @Input() link = '';
  @Input() time = '';
  @Output() removed = new EventEmitter<string>();

  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  theme = inject(ThemeService);
  hovered = false;

  private toast(message: string): void {
    this.snackBar.open(message, '', { duration: 2500, horizontalPosition: 'center', verticalPosition: 'bottom' });
  }

  openLink(): void {
    if (this.link) {
      window.open(this.link, '_blank');
    }
  }

  deleteHistory(event: Event): void {
    event.stopPropagation();
    this.api.post<any>('/api/history/remove', { baseURL: this.link }).subscribe(res => {
      if (res?.success !== false) {
        this.toast(res?.message || 'History item removed');
      } else {
        this.toast(res?.message || 'Error removing history item');
      }
      this.removed.emit(this.link);
    });
  }
}

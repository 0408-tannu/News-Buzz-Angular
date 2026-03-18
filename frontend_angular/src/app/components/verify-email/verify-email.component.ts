import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  @Input() username = '';
  @Input() email = '';
  @Output() verified = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  code: string[] = ['', '', '', '', '', ''];
  backendCode = '';
  isLoading = false;
  isSending = true;
  errorMessage = '';

  constructor(private api: ApiService, private snackBar: MatSnackBar) {}

  private toast(message: string): void {
    this.snackBar.open(message, '', { duration: 2500, horizontalPosition: 'center', verticalPosition: 'bottom' });
  }

  ngOnInit(): void {
    this.sendVerificationEmail();
  }

  sendVerificationEmail(): void {
    this.isSending = true;
    this.api.post<any>('/api/sendemail/forgotpassword', {
      username: this.username,
      email: this.email,
      CheckUserExist: false
    }).subscribe({
      next: (res) => {
        this.isSending = false;
        if (res?.success) {
          this.backendCode = res.code;
          this.toast(res?.message || 'Verification code sent!');
        } else {
          this.errorMessage = res?.message || 'Failed to send verification email.';
          this.toast(this.errorMessage);
        }
      },
      error: () => {
        this.isSending = false;
        this.errorMessage = 'Something went wrong.';
      }
    });
  }

  onCodeInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (!/^\d$/.test(value)) {
      input.value = '';
      this.code[index] = '';
      return;
    }

    this.code[index] = value;

    if (index < 5 && value) {
      const next = document.getElementById(`verify-code-${index + 1}`) as HTMLInputElement;
      if (next) next.focus();
    }
  }

  onCodeKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (this.code[index] === '') {
        if (index > 0) {
          this.code[index - 1] = '';
          const prev = document.getElementById(`verify-code-${index - 1}`) as HTMLInputElement;
          if (prev) {
            prev.value = '';
            prev.focus();
          }
        }
      } else {
        this.code[index] = '';
        (event.target as HTMLInputElement).value = '';
      }
    }
  }

  submitCode(): void {
    if (this.code.some(d => !d)) return;

    const entered = this.code.join('');
    if (this.backendCode && entered !== this.backendCode) {
      this.errorMessage = 'Invalid verification code.';
      this.toast(this.errorMessage);
      return;
    }

    this.verified.emit();
  }

  onOverlayClick(event: Event): void {
    if ((event.target as HTMLElement).classList.contains('verify-overlay')) {
      this.closed.emit();
    }
  }
}

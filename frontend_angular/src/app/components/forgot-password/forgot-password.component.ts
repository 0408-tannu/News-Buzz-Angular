import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import * as CryptoJS from 'crypto-js';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  @Output() closed = new EventEmitter<void>();

  currentStep = 1;
  email = '';
  code: string[] = ['', '', '', '', '', ''];
  newPassword = '';
  confirmPassword = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private api: ApiService, private snackBar: MatSnackBar) {}

  private toast(message: string): void {
    this.snackBar.open(message, '', { duration: 2500, horizontalPosition: 'center', verticalPosition: 'bottom' });
  }

  submitEmail(): void {
    if (!this.email) return;
    this.isLoading = true;
    this.errorMessage = '';

    this.api.post<any>('/api/sendemail/forgotpassword', {
      email: this.email,
      CheckUserExist: true
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res?.success) {
          this.successMessage = res.message || 'Verification code sent!';
          this.toast(this.successMessage);
          this.currentStep = 2;
        } else {
          this.errorMessage = res?.message || 'Failed to send email.';
          this.toast(this.errorMessage);
        }
      },
      error: () => {
        this.isLoading = false;
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
      const next = document.getElementById(`forgot-code-${index + 1}`) as HTMLInputElement;
      if (next) next.focus();
    }
  }

  onCodeKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (this.code[index] === '') {
        if (index > 0) {
          this.code[index - 1] = '';
          const prev = document.getElementById(`forgot-code-${index - 1}`) as HTMLInputElement;
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
    this.isLoading = true;
    this.errorMessage = '';

    this.api.post<any>('/api/sendemail/forgotpassword/verifycode', {
      email: this.email,
      code: this.code
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res?.success) {
          this.successMessage = res.message || 'Code verified!';
          this.toast(this.successMessage);
          this.currentStep = 3;
        } else {
          this.errorMessage = res?.message || 'Invalid code.';
          this.toast(this.errorMessage);
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Something went wrong.';
      }
    });
  }

  submitNewPassword(): void {
    if (!this.newPassword || !this.confirmPassword) return;
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      this.toast(this.errorMessage);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const encrypted = CryptoJS.AES.encrypt(this.newPassword, environment.PWD_SECRET).toString();

    this.api.post<any>('/api/sendemail/forgotpassword/resetpassword', {
      email: this.email,
      password: encrypted
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res?.success) {
          this.successMessage = res.message || 'Password reset successfully!';
          this.toast(this.successMessage);
          setTimeout(() => this.closed.emit(), 1500);
        } else {
          this.errorMessage = res?.message || 'Failed to reset password.';
          this.toast(this.errorMessage);
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Something went wrong.';
      }
    });
  }

  onOverlayClick(event: Event): void {
    if ((event.target as HTMLElement).classList.contains('forgot-overlay')) {
      this.closed.emit();
    }
  }
}

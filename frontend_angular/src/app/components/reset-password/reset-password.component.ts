import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  @Output() closed = new EventEmitter<void>();

  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  private toast(message: string): void {
    this.snackBar.open(message, '', { duration: 2500, horizontalPosition: 'center', verticalPosition: 'bottom' });
  }

  get requirements() {
    return {
      length: this.newPassword.length >= 8,
      number: /\d/.test(this.newPassword),
      special: /[!@#$%^&*]/.test(this.newPassword),
      capital: /[A-Z]/.test(this.newPassword),
    };
  }

  get strength(): string {
    const met = Object.values(this.requirements).filter(Boolean).length;
    if (met === 4) return 'strong';
    if (met >= 2) return 'medium';
    if (met >= 1) return 'weak';
    return 'none';
  }

  get canSubmit(): boolean {
    return (
      !!this.oldPassword &&
      !!this.newPassword &&
      !!this.confirmPassword &&
      this.newPassword === this.confirmPassword &&
      this.strength === 'strong'
    );
  }

  submit(): void {
    if (!this.canSubmit) return;

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      this.toast(this.errorMessage);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const encOld = CryptoJS.AES.encrypt(this.oldPassword, environment.PWD_SECRET).toString();
    const encNew = CryptoJS.AES.encrypt(this.newPassword, environment.PWD_SECRET).toString();

    this.api.post<any>('/api/changepassword', {
      CurrentPassword: encOld,
      password: encNew
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res?.caught) {
          this.closed.emit();
          this.router.navigate(['/login']);
          return;
        }
        if (res?.success) {
          this.successMessage = res.message || 'Password changed successfully!';
          this.toast(this.successMessage);
          setTimeout(() => this.closed.emit(), 1500);
        } else {
          this.errorMessage = res?.message || 'Failed to change password.';
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
    if ((event.target as HTMLElement).classList.contains('reset-overlay')) {
      this.closed.emit();
    }
  }
}

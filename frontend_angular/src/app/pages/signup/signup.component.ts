import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import * as CryptoJS from 'crypto-js';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { LogoComponent } from '../../components/logo/logo.component';
import { VerifyEmailComponent } from '../../components/verify-email/verify-email.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    LogoComponent,
    VerifyEmailComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  errorMessage = '';
  showVerifyEmail = false;
  pendingSignupData: { username: string; email: string; password: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.signupForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private toast(message: string): void {
    this.snackBar.open(message, '', {
      duration: 2500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  /** Custom validator: password must contain uppercase, lowercase, number, special char */
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    const errors: ValidationErrors = {};
    if (!hasUpperCase) errors['missingUppercase'] = true;
    if (!hasLowerCase) errors['missingLowercase'] = true;
    if (!hasNumber) errors['missingNumber'] = true;
    if (!hasSpecialChar) errors['missingSpecialChar'] = true;

    return Object.keys(errors).length ? errors : null;
  }

  /** Cross-field validator: passwords must match */
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      this.toast('Please fill out all fields correctly.');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { username, email, password } = this.signupForm.value;

    // Step 1: Check if user already exists
    this.api.post<any>('/api/user/isuserexistwhensignup', { email }).subscribe({
      next: (res) => {
        if (res?.success === false) {
          this.isLoading = false;
          this.errorMessage = res?.message || 'An account with this email already exists. Please log in.';
          this.toast(this.errorMessage);
          return;
        }

        // Step 2: Show verify email modal instead of signing up directly
        this.isLoading = false;
        this.pendingSignupData = { username, email, password };
        this.showVerifyEmail = true;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Signup failed';
        this.toast(this.errorMessage);
      },
    });
  }

  onEmailVerified(): void {
    if (!this.pendingSignupData) return;

    this.showVerifyEmail = false;
    this.isLoading = true;

    const { username, email, password } = this.pendingSignupData;
    const encryptedPassword = CryptoJS.AES.encrypt(password, environment.PWD_SECRET).toString();

    this.api.post<any>('/api/user/signup', { username, email, password: encryptedPassword }).subscribe({
      next: (signupRes) => {
        this.isLoading = false;
        if (signupRes?.success && signupRes?.token) {
          this.toast('Signup successful!');
          this.auth.setToken(signupRes.token);
          this.router.navigate(['/']);
        } else {
          this.errorMessage = signupRes?.message || 'Signup failed. Please try again.';
          this.toast(this.errorMessage);
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Signup failed';
        this.toast(this.errorMessage);
      },
    });
  }

  onVerifyClosed(): void {
    this.showVerifyEmail = false;
    this.pendingSignupData = null;
  }
}

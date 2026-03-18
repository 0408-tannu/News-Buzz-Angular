import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import * as CryptoJS from 'crypto-js';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { LogoComponent } from '../../components/logo/logo.component';
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    LogoComponent,
    ForgotPasswordComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage = '';
  showForgotPassword = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  private toast(message: string): void {
    this.snackBar.open(message, '', {
      duration: 2500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  forgotPassword(): void {
    this.showForgotPassword = true;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;
    const encryptedPassword = CryptoJS.AES.encrypt(password, environment.PWD_SECRET).toString();

    this.api.post<any>('/api/user/login', { email, password: encryptedPassword }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res?.success && res?.token) {
          this.toast('Logged in successfully');
          this.auth.setToken(res.token);
          this.router.navigate(['/']);
        } else {
          this.errorMessage = res?.message || 'Login failed. Please try again.';
          this.toast(this.errorMessage);
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Error occurred!';
        this.toast(this.errorMessage);
      },
    });
  }
}

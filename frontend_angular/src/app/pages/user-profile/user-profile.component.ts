import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { ResetPasswordComponent } from '../../components/reset-password/reset-password.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ResetPasswordComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private snackBar = inject(MatSnackBar);
  theme = inject(ThemeService);

  private toast(message: string): void {
    this.snackBar.open(message, '', { duration: 2500, horizontalPosition: 'center', verticalPosition: 'bottom' });
  }

  isLoading = true;
  isSaving = false;
  successMessage = '';
  errorMessage = '';
  showResetPassword = false;

  profileImg = '';
  username = '';
  firstName = '';
  lastName = '';
  age: number | null = null;
  phoneNo = '';
  email = '';
  topics: string[] = [];
  newTopic = '';

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.api.get<any>('/api/user/userprofile/get').subscribe(res => {
      this.isLoading = false;
      if (res?.caught) {
        this.router.navigate(['/login']);
        return;
      }
      if (res?.user) {
        const u = res.user;
        this.profileImg = u.profileImg || '';
        this.username = u.username || '';
        this.firstName = u.firstName || '';
        this.lastName = u.lastName || '';
        this.age = u.age || null;
        this.phoneNo = u.phoneNo || '';
        this.email = u.email || '';
        this.topics = u.topics || [];
      }
      this.cdr.detectChanges();
    });
  }

  addTopic(): void {
    const topic = this.newTopic.trim();
    if (topic && !this.topics.includes(topic)) {
      this.topics.push(topic);
    }
    this.newTopic = '';
  }

  removeTopic(topic: string): void {
    this.topics = this.topics.filter(t => t !== topic);
  }

  updateProfile(): void {
    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const data = {
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      age: this.age,
      phoneNo: this.phoneNo,
      topics: this.topics,
    };

    this.api.post<any>('/api/user/userprofile/update', data).subscribe(res => {
      this.isSaving = false;
      if (res?.caught) {
        this.router.navigate(['/login']);
        return;
      }
      if (res?.success !== false) {
        this.successMessage = res?.message || 'Profile updated successfully!';
        this.toast(this.successMessage);
      } else {
        this.errorMessage = res?.message || 'Failed to update profile.';
        this.toast(this.errorMessage);
      }
      this.cdr.detectChanges();
    });
  }

  changePassword(): void {
    this.showResetPassword = true;
  }
}

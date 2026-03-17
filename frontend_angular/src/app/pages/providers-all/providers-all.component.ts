import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { NewsProviderCardComponent } from '../../components/news-provider-card/news-provider-card.component';

interface Provider {
  name: string;
  baseURL: string;
  logo?: string;
}

@Component({
  selector: 'app-providers-all',
  standalone: true,
  imports: [CommonModule, MatIconModule, NewsProviderCardComponent],
  templateUrl: './providers-all.component.html',
  styleUrls: ['./providers-all.component.scss'],
})
export class ProvidersAllComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  theme = inject(ThemeService);

  providers: Provider[] = [];
  isLoading = true;

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.api.get<any>('/api/provider/get_all_providers').subscribe(res => {
      this.isLoading = false;
      if (res?.caught) {
        this.router.navigate(['/login']);
        return;
      }
      if (res?.providers) {
        this.providers = res.providers;
      }
      this.cdr.detectChanges();
    });
  }
}

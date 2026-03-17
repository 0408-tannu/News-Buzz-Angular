import { Component, inject, OnInit, HostListener, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { LogoComponent } from '../logo/logo.component';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    LogoComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Input() leftOffset = '0px';

  theme = inject(ThemeService);
  auth = inject(AuthService);
  api = inject(ApiService);
  router = inject(Router);
  private route = inject(ActivatedRoute);
  private elRef = inject(ElementRef);
  private snackBar = inject(MatSnackBar);

  private toast(message: string): void {
    this.snackBar.open(message, '', { duration: 2500, horizontalPosition: 'center', verticalPosition: 'bottom' });
  }

  searchQuery = '';
  selectedTopic = '';

  // Advanced search
  advancedSearchOpen = false;
  advancedSite = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  today = new Date();

  // Topic chips
  quickSearchText: string[] = [];
  quickSearchLoading = true;
  newQuickSearch = '';
  showAddBox = false;

  defaultTopics = ['AI', 'FINANCE', 'TECH', 'EDUCATION', 'ENTERTAINMENT', 'CLIMATE CHANGE', 'SOCIETY', 'CULTURE', 'SPORTS'];

  // Remove topic dialog
  removeDialogOpen = false;
  removeDialogText = '';

  // GLOBAL location filter
  globalMenuOpen = false;
  countries: ICountry[] = [];
  states: IState[] = [];
  cities: ICity[] = [];
  selectedCountry: ICountry | null = null;
  selectedState: IState | null = null;
  selectedCity: ICity | null = null;

  ngOnInit(): void {
    this.countries = Country.getAllCountries();
    if (this.auth.isLoggedIn()) {
      this.fetchQuickSearch();
    } else {
      this.quickSearchLoading = false;
    }

    // Sync selectedTopic with current route query param
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe((e) => {
      if (e.urlAfterRedirects.startsWith('/search')) {
        const params = new URLSearchParams(e.urlAfterRedirects.split('?')[1] || '');
        this.selectedTopic = params.get('q') || '';
      } else {
        this.selectedTopic = '';
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const advPanel = this.elRef.nativeElement.querySelector('.advanced-search-panel');
    const dropBtn = this.elRef.nativeElement.querySelector('.dropdown-btn');
    const inDatepicker = !!(target as HTMLElement).closest?.('.mat-datepicker-popup, .cdk-overlay-container, .mat-calendar');
    if (this.advancedSearchOpen && advPanel && !advPanel.contains(target) && !dropBtn?.contains(target) && !inDatepicker) {
      this.advancedSearchOpen = false;
    }
    const addPopup = this.elRef.nativeElement.querySelector('.add-topic-popup');
    const addBtn = this.elRef.nativeElement.querySelector('.add-topic-btn');
    if (this.showAddBox && addPopup && !addPopup.contains(target) && !addBtn?.contains(target)) {
      this.showAddBox = false;
    }
    const globalPanel = this.elRef.nativeElement.querySelector('.global-panel');
    const globalChip = this.elRef.nativeElement.querySelector('.global-chip');
    if (this.globalMenuOpen && globalPanel && !globalPanel.contains(target) && !globalChip?.contains(target)) {
      this.closeGlobalMenu();
    }
  }

  openRemoveDialog(event: MouseEvent, text: string): void {
    event.preventDefault();
    this.removeDialogText = text;
    this.removeDialogOpen = true;
  }

  confirmRemoveTopic(): void {
    this.removeQuickSearch(this.removeDialogText);
    this.removeDialogOpen = false;
  }

  fetchQuickSearch(): void {
    this.quickSearchLoading = true;
    this.api.get<any>('/api/quicksearch/get').subscribe({
      next: (res) => {
        if (res?.success && res.quickSearchText && res.quickSearchText.length > 0) {
          this.quickSearchText = res.quickSearchText;
        } else {
          this.quickSearchText = [...this.defaultTopics];
        }
        this.quickSearchLoading = false;
      },
      error: () => {
        this.quickSearchText = [...this.defaultTopics];
        this.quickSearchLoading = false;
      }
    });
  }

  onSearch(): void {
    const q = this.searchQuery.trim();
    if (q) {
      this.router.navigate(['/search'], { queryParams: { q } });
    }
  }

  toggleAdvanced(): void {
    this.advancedSearchOpen = !this.advancedSearchOpen;
  }

  onAdvancedSearch(): void {
    const q = this.searchQuery.trim();
    const params: any = {};
    if (q) params.q = q;
    if (this.advancedSite.trim()) params.site = this.advancedSite.trim();

    if (this.startDate && this.endDate) {
      const sd = this.startDate;
      const ed = this.endDate;
      params.tbs = `cdr:1,cd_min:${sd.getMonth() + 1}/${sd.getDate()}/${sd.getFullYear()},cd_max:${ed.getMonth() + 1}/${ed.getDate()}/${ed.getFullYear()}`;
    }

    this.advancedSearchOpen = false;
    this.router.navigate(['/search'], { queryParams: params });
  }

  onTopicClick(text: string): void {
    this.selectedTopic = text;
    this.router.navigate(['/search'], { queryParams: { q: text } });
  }

  toggleGlobalMenu(): void {
    this.globalMenuOpen = !this.globalMenuOpen;
    if (!this.globalMenuOpen) {
      this.resetLocationSelections();
    }
  }

  closeGlobalMenu(): void {
    this.globalMenuOpen = false;
    this.resetLocationSelections();
  }

  resetLocationSelections(): void {
    this.selectedCountry = null;
    this.selectedState = null;
    this.selectedCity = null;
    this.states = [];
    this.cities = [];
  }

  onCountryChange(event: Event): void {
    const isoCode = (event.target as HTMLSelectElement).value;
    this.selectedCountry = this.countries.find(c => c.isoCode === isoCode) || null;
    this.selectedState = null;
    this.selectedCity = null;
    this.cities = [];
    this.states = this.selectedCountry ? State.getStatesOfCountry(this.selectedCountry.isoCode) : [];
  }

  onStateChange(event: Event): void {
    const isoCode = (event.target as HTMLSelectElement).value;
    this.selectedState = this.states.find(s => s.isoCode === isoCode) || null;
    this.selectedCity = null;
    this.cities = this.selectedCountry && this.selectedState
      ? City.getCitiesOfState(this.selectedCountry.isoCode, this.selectedState.isoCode)
      : [];
  }

  onCityChange(event: Event): void {
    const name = (event.target as HTMLSelectElement).value;
    this.selectedCity = this.cities.find(c => c.name === name) || null;
  }

  findLocalizedNews(): void {
    if (!this.selectedCountry) return;
    const location = this.selectedCity?.name || this.selectedState?.name || '';
    this.router.navigate(['/search'], {
      queryParams: { gl: this.selectedCountry.isoCode, location }
    });
    this.closeGlobalMenu();
  }

  addQuickSearch(): void {
    if (!this.newQuickSearch.trim()) return;
    if (!this.auth.isLoggedIn()) return;

    this.api.post<any>('/api/quicksearch/add', { quickSearchTextFromFrontend: this.newQuickSearch }).subscribe({
      next: (res) => {
        if (res?.caught) {
          this.router.navigate(['/login']);
          return;
        }
        if (res?.success) {
          this.quickSearchText = [...this.quickSearchText, this.newQuickSearch];
          this.newQuickSearch = '';
          this.showAddBox = false;
        }
      }
    });
  }

  removeQuickSearch(text: string): void {
    if (!this.auth.isLoggedIn()) return;

    this.api.post<any>('/api/quicksearch/delete', { quickSearchText: text }).subscribe({
      next: (res) => {
        if (res?.caught) {
          this.router.navigate(['/login']);
          return;
        }
        if (res?.success) {
          this.quickSearchText = this.quickSearchText.filter(t => t !== text);
          this.toast(res?.message || 'Quick search deleted');
        } else {
          this.toast(res?.message || 'Error deleting quick search');
        }
      },
      error: () => {
        this.toast('Error deleting quick search');
      }
    });
  }
}

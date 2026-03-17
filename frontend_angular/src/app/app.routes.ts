import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent) },
  { path: 'search', loadComponent: () => import('./pages/search-results/search-results.component').then(m => m.SearchResultsComponent) },
  { path: 'myfeed', loadComponent: () => import('./pages/my-feed/my-feed.component').then(m => m.MyFeedComponent) },
  { path: 'account', loadComponent: () => import('./pages/user-profile/user-profile.component').then(m => m.UserProfileComponent) },
  { path: 'bookmark', loadComponent: () => import('./pages/bookmark/bookmark.component').then(m => m.BookmarkComponent) },
  { path: 'history', loadComponent: () => import('./pages/history/history.component').then(m => m.HistoryComponent) },
  { path: 'providers/all', loadComponent: () => import('./pages/providers-all/providers-all.component').then(m => m.ProvidersAllComponent) },
  { path: 'providers/following', loadComponent: () => import('./pages/providers-following/providers-following.component').then(m => m.ProvidersFollowingComponent) },
  { path: 'following', redirectTo: 'providers/following', pathMatch: 'full' },
  { path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) }
];

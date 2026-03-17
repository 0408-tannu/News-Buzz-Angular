import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.BACKEND_API;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      authorization: `Bearer ${token}`
    });
  }

  private getJsonHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`
    });
  }

  get<T>(url: string): Observable<T> {
    const fullUrl = this.baseUrl + url;
    console.log('[API] GET', fullUrl);
    return this.http
      .get<T>(fullUrl, { headers: this.getAuthHeaders() })
      .pipe(
        tap(res => console.log('[API] GET response:', url, res)),
        catchError(err => {
          console.error('[API] GET error:', url, err);
          return of({ success: false, message: 'An error occurred while fetching data.' } as any);
        })
      );
  }

  post<T>(url: string, data: any): Observable<T> {
    const fullUrl = this.baseUrl + url;
    console.log('[API] POST', fullUrl, data);
    return this.http
      .post<T>(fullUrl, data, { headers: this.getJsonHeaders() })
      .pipe(
        tap(res => console.log('[API] POST response:', url, res)),
        catchError(err => {
          console.error('[API] POST error:', url, err);
          return of({ success: false, message: 'An error occurred while sending data.' } as any);
        })
      );
  }

  delete<T>(url: string, data?: any): Observable<T> {
    const fullUrl = this.baseUrl + url;
    console.log('[API] DELETE', fullUrl);
    return this.http
      .delete<T>(fullUrl, { headers: this.getJsonHeaders(), body: data })
      .pipe(
        tap(res => console.log('[API] DELETE response:', url, res)),
        catchError(err => {
          console.error('[API] DELETE error:', url, err);
          return of({ success: false, message: 'An error occurred while deleting data.' } as any);
        })
      );
  }

  postFormData<T>(url: string, formData: FormData): Observable<T> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      authorization: `Bearer ${token}`
    });
    return this.http
      .post<T>(this.baseUrl + url, formData, { headers })
      .pipe(catchError(err => {
        console.error('[API] POST FormData error:', url, err);
        return of({ success: false, message: 'An error occurred.' } as any);
      }));
  }
}

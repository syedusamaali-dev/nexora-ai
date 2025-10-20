import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'http://localhost:5000/api';

  get<T>(
    endpoint: string,
    params?: Record<string, string>
  ): Observable<T> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        httpParams = httpParams.set(key, value);
      });
    }

    return this.http.get<T>(
      `${this.baseUrl}${endpoint}`,
      { params: httpParams }
    );
  }

  post<T>(
    endpoint: string,
    body?: unknown
  ): Observable<T> {
    return this.http.post<T>(
      `${this.baseUrl}${endpoint}`,
      body
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(
      `${this.baseUrl}${endpoint}`
    );
  }

  upload<T>(
    endpoint: string,
    formData: FormData
  ): Observable<T> {
    return this.http.post<T>(
      `${this.baseUrl}${endpoint}`,
      formData
    );
  }
}
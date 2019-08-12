import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ManagerService {
  private baseUrl = 'http://117.78.11.72:8080';
  userId: string;
  constructor(private http: HttpClient) {
    this.userId = window.localStorage.getItem('userId');
  }

  getPortfoliosList(): Observable<any> {
    const url = `${this.baseUrl}/portfolio?user_id=3`;
    /*return this.http
      .request('GET', url,
        {
          responseType: 'json',
          params
        });*/
    return this.http.get(url);
  }

  addPortFolio(name: string): Observable<any> {
    const url = `${this.baseUrl}/portfolio`;
    const params = new HttpParams().set('userId', '3').set('portfolioName', name);
    return this.http
      .request('POST', url,
        {
          responseType: 'json',
          params
        });
  }

  deletePortFolio(portfolioId: string): Observable<any> {
    const headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
    // headers.set('Access-Control-Allow-Headers', 'X-Requested-With');
    headers.set('Access-Control-Allow-Headers', 'Authorization, X-Requested-With, Access-Control-Allow-Methods, Access-Control-Allow-Origin');
    headers.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    const url = `${this.baseUrl}/portfolio`;
    const params = new HttpParams().set('portfolio_id', portfolioId);
    return this.http
      .request('DELETE', url,
        {
          responseType: 'json',
          params,
          headers
        });
  }

  getSecurityList(): Observable<any> {
    const url = `${this.baseUrl}/security`;
    /*return this.http
      .request('GET', url,
        {
          responseType: 'json',
          params
        });*/
    return this.http.get(url);
  }
}

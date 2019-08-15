import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ManagerService {
  // private baseUrl = 'http://192.168.43.49:8080';
  private baseUrl = 'http://117.78.11.72:8080';
  // private baseUrl = 'http://localhost:8080';
  userId: string;
  constructor(private http: HttpClient) {
    this.userId = window.localStorage.getItem('userId');
  }

  getPortfoliosList(): Observable<any> {
    const url = `${this.baseUrl}/portfolio`;
    const params = new HttpParams().set('userId', this.userId)
    /*return this.http
      .request('GET', url,
        {
          responseType: 'json',
          params
        });*/
    return this.http
      .request('GET', url,
        {
          responseType: 'json',
          params
        });
  }

  addPortFolio(name: string): Observable<any> {
    const url = `${this.baseUrl}/portfolio`;
    const params = new HttpParams().set('userId', this.userId).set('portfolioName', name);
    return this.http
      .request('POST', url,
        {
          responseType: 'json',
          params
        });
  }

  deletePortFolio(portfolioId: string): Observable<any> {
    const url = `${this.baseUrl}/portfolio/${portfolioId}`;
    return this.http
      .request('DELETE', url,
        {
          responseType: 'json'
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

  addPosition(portfolioId: string, securityId: string, count: number): Observable<any> {
    const url = `${this.baseUrl}/position`;
    const params = new HttpParams().set('portfolioId', portfolioId).set('securityId', securityId).set('quantity', count.toString());
    console.log(params);
    return this.http
      .request('POST', url,
        {
          responseType: 'json',
          params
        });
  }

  getPositions(portfolioId: string): Observable<any> {
    const url = `${this.baseUrl}/portfolio/${portfolioId}`;
    return this.http
      .request('GET', url,
        {
          responseType: 'json',
        });
  }
  deletePosition(positionId: string): Observable<any> {
    const url = `${this.baseUrl}/position/${positionId}`;
    return this.http
      .request('DELETE', url,
        {
          responseType: 'json'
        });
  }

  updatePosition(portfolioId: string, positionId: string, quantity: number): Observable<any> {
    const url = `${this.baseUrl}/position/${positionId}`;
    const params = new HttpParams().set('quantity', String(quantity)).set('portfolioId', portfolioId);
    console.log(params);
    return this.http
      .request('POST', url,
        {
          responseType: 'json',
          params
        });
  }
}

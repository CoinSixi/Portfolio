import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = 'http://117.78.11.72:8080';
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/user/login`;
    const params = new HttpParams().set('username', username).set('password', password);
    // return this.http.post(url,params);
    return this.http
      .request('POST', 'http://117.78.11.72:8080/user/login',
        {
          responseType: 'json',
          params
        });
  }
}

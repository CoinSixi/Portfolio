import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User} from './entities/User';
import {catchError} from 'rxjs/internal/operators';
import {Result} from './entities/Result';

// @ts-ignore
@Injectable({
  providedIn: 'root'
})

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'})
}
export class LoginService {
  private baseUrl = 'http://localhost:8080';  // URL to web api
  result: Result<any> = {
    code: 1,
    msg: 'error',
    detail: 'error',
    duration: 0,
    data: null,
  };
  constructor(private http: HttpClient) { }

  signIn(username: string, password: string): Observable<Result<any>> {
    const params = new HttpParams().set('username', username).set('password', password);
    const url = `${this.baseUrl}/user`;
    console.log(url);
    // @ts-ignore
    return this.http.post(url, params, httpOptions);
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

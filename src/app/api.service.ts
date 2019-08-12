import { Injectable, Inject, InjectionToken } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import 'rxjs';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';

// export const API_URL = new InjectionToken<string>('117.78.11.72:8080/');
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://117.78.11.72:8080';
  constructor(
    private http: HttpClient,
    // @Inject(API_URL) public urlPrefix,
    private router: Router,
    private notification: NzNotificationService,
  ) { }
  hearders() {
    const hearders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        // Accept: 'application/json'
      }),
    };
    return hearders;
  }
  /**
   * 请求验证
   * @param e 服务器返回数据
   */
  callbackCode(e: { resCode: any; resMsg: string; }) {
    switch (e.resCode) {
      case '00000':
        return e;
      case '01' || '02' || '03':
        this.notification.create('warning', '系统提示',
          e.resMsg);
        break;
      case '04':
        this.notification.create('error', '系统提示',
          e.resMsg);
        break;
      case '401401':
        // this.tokenService.clear();
        this.router.navigateByUrl('usr/login');

    }
  }
  /** 登录 */
  login(username: string, password: string): Observable<any> {
    const params = new HttpParams().set('username', username).set('password', password);
   // return this.http.post(this.urlPrefix + 'account/login?userCode=' + params.userCode + '&password=' + params.password, null);
    return this.http.post(this.baseUrl + '/user/login', params);
  }
  /** 登出 */
  logoOut() {
    // this.tokenService.clear();
    this.router.navigateByUrl('passport/login');
  }

}

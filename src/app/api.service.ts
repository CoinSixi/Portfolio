import { Injectable, Inject, InjectionToken } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders, HttpRequest} from '@angular/common/http';
import 'rxjs';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {NzNotificationService, UploadFile} from 'ng-zorro-antd';
import set = Reflect.set;

// export const API_URL = new InjectionToken<string>('117.78.11.72:8080/');
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // private baseUrl = 'http://192.168.43.49:8080';
  private baseUrl = 'http://117.78.11.72:8080';

  constructor(
    private http: HttpClient,
    // @Inject(API_URL) public urlPrefix,
    private router: Router,
    private notification: NzNotificationService,
  ) {
  }

  hearders() {
    const hearders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'Content-Type': 'application/json; charset=utf-8',
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
    return this.http.post(this.baseUrl + '/user/login', params);
  }

  /** 登出 */
  logoOut() {
    // this.tokenService.clear();
    this.http.get('/user/logout');
    // this.router.navigateByUrl('/user/logout');
  }

  getportfolios(): Observable<any> {
    return this.http.get(this.baseUrl + '/portfolio/list');
  }

  getfundusers(): Observable<any> {
    return this.http.get(this.baseUrl + '/admin/funduser');
  }

  // 有参数，有花括号
  updatefunduser(param): Observable<any> {
    const params = new HttpParams({fromObject: param});
    console.log('param:' + param.userId);
    return this.http.post(this.baseUrl + '/admin/funduser/' + param.userId, params);
  }

  addfunduser(param): Observable<any> {
    const params = new HttpParams({fromObject: param});
    return this.http.post(this.baseUrl + '/admin/funduser', params);
  }

  // 待验证，觉得后台改接口
  delfunduser(userId: string): Observable<any> {
    console.log('删除funduser链接：' + this.baseUrl + '/admin/funduser/' + userId);
    return this.http.delete(this.baseUrl + '/admin/funduser/' + userId);
  }

  // 股票API  实体类字段不全
  getSecurities(): Observable<any> {
    // 后台给的url是： /admin/securiy
    return this.http.get(this.baseUrl + '/admin/security');
  }

  addSecurity(name: string, type: string): Observable<any> {
    const params = new HttpParams().set('securityName', name).set('securityType', type);
    return this.http.post(this.baseUrl + '/admin/security', params);
  }

  updateSecurity(param): Observable<any> {
    // 接口未明确
    const params = new HttpParams().set('value', param.todayPrice);
    return this.http.post(this.baseUrl + '/admin/price/' + param.priceId, params);
  }

  delSecurity(securityId: string): Observable<any> {
    return this.http.delete(this.baseUrl + '/admin/security/' + securityId);
  }

  // 价格API
  getPrice(priceId: string): Observable<any> {
    // 后台未确定
    return this.http.get(this.baseUrl + '/admin/price/' + priceId);
  }

  addPrice(securityId: string, value: string): Observable<any> {
    const params = new HttpParams().set('securityId', securityId).set('value', value);
    return this.http.post(this.baseUrl + '/admin/price', params);
  }

  updatePrice(param): Observable<any> {
    const params = new HttpParams({fromObject: param});
    return this.http.post(this.baseUrl + '/admin/price/' + param.priceId, params);
  }

  delPrice(priceId: string): Observable<any> {
    // 接口未明确
    return this.http.delete(this.baseUrl + '/admin/price' + priceId);
  }

  /*get(url: string, params?: any): Observable<any> {
    if (params && params['query']) {
      params['query'] = JSON.stringify(params['query']);
    }
    const p = new HttpParams({
      fromObject: params
    });
    return this.http.get(this.urlPrefix + url, {
      params: p,
      withCredentials: true
    });
  }*/
  uploadFile(securityId: string, file: UploadFile, dateName: string, priceName: string): Observable<any> {
    const formData = new FormData();
    // @ts-ignore
    formData.append('file', file);
    formData.append('dateName', dateName);
    formData.append('priceName', priceName);
    const req = new HttpRequest('POST', this.baseUrl + '/security/upload/' + securityId, formData, {
      // reportProgress: true
    });
    return this.http.request(req);
  }

  getHistoryPrice(portfolioId: string): Observable<any>  {
    return this.http.get(this.baseUrl + '/portfolio/history/' + portfolioId);
  }
}

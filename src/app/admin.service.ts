import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  // /admin/funduser
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }


}

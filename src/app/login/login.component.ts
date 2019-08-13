import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {ApiService} from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  text1: string;
  constructor(public router: Router, private apiService: ApiService) { }

  ngOnInit() {
  }

  signIn(): void {
    /*if (this.username === '1') {
      this.router.navigate(['/manager/portfolios']);
    } else {
      this.router.navigate(['/administrator/fund-manager']);
    }*/
    this.apiService.login(this.username, this.password).subscribe(
      response => {
        if (response.code === 200 ) {
          const data = response.data;
          window.localStorage.setItem('userId', data.userId);
          window.localStorage.setItem('username', this.username);
          window.localStorage.setItem('role', data.role);
          window.localStorage.setItem('token', data.token);
          if (data.role === 'administrator') {
            this.router.navigateByUrl('/administrator/fund-manager');
          } else if (data.role === 'manager') {
            this.router.navigateByUrl('/manager/portfolios');
          }
        } else {
          this.text1 = response.msg;
          this.router.navigateByUrl('/login');
        }
      }
    );
  }
}

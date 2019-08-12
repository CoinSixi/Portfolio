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
  constructor(
    private api: ApiService,
    private router: Router,
    // private loginService: LoginService
  ) { }

  ngOnInit() {
  }

  signIn(): void {
    /*this.loginService.signIn(this.username, this.password).subscribe(
      respose => {
        console.log(respose);
      }
    );*/
    this.api.login(this.username, this.password).subscribe(
      respose => {
        if (respose.code === 200 ) {
          const data = respose.data;
          if (data.role === 'administrator') {
            this.router.navigateByUrl('/administrator/fund-manager');
          } else if (data.role === 'manager') {
            this.router.navigateByUrl('/manager/portfolios');
          }
        } else {
          this.text1 = respose.msg;
          this.router.navigateByUrl('/login');
        }
      }
    );



  }
}

import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {ApiService} from '../api.service';
import {NzMentionService, NzMessageBaseService, NzMessageModule, NzMessageService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(public router: Router, private apiService: ApiService, private message: NzMessageService, private fb: FormBuilder) { }
  username: string;
  password: string;
  text1: string;
  checked = false;
  validateForm: FormGroup;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  ngOnInit() {
    if (window.localStorage.getItem('username') !== null && window.localStorage.getItem('password') !== null) {
      this.username = window.localStorage.getItem('username');
      this.password = window.localStorage.getItem('password');
    }
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }
  signIn(): void {
    this.apiService.login(this.username, this.password).subscribe(
      response => {
        if (response.code === 200 ) {
          const data = response.data;
          console.log(data.userId);
          window.localStorage.setItem('userId', data.userId);
          window.localStorage.setItem('username', this.username);
          window.localStorage.setItem('role', data.role);
          window.localStorage.setItem('token', data.token);
          console.log(window.localStorage.getItem('userId'));
          if (this.checked) {
            window.localStorage.setItem('password', this.password);
          } else {
            window.localStorage.removeItem('password');
          }
          if (data.role === 'administrator') {
            this.router.navigateByUrl('/administrator/fund-manager');
          } else if (data.role === 'manager') {
            this.router.navigateByUrl('/manager/portfolios');
          }
        } else {
          this.text1 = response.msg;
          this.message.error('Login Failure:' + response.msg, {
            nzDuration: 2000
          });
        }
      }
    );
  }
}

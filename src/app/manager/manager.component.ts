import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {ApiService} from '../api.service';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {
  isCollapsed = false;
  username = window.localStorage.getItem('username');
  constructor(private router: Router, private api: ApiService, private message: NzMessageService) { }

  ngOnInit() {
  }

  select(num: number): void {
    if (num === 1) {
      this.router.navigate(['/manager/portfolios']);
    } else {
      this.router.navigate(['/manager/securities']);
    }
  }

  logout(): void {
    this.api.logoOut().subscribe(
      response => {
        console.log(response);
        if (response.code === 200 ) {
          window.localStorage.removeItem('userId');
          window.localStorage.removeItem('role');
          window.localStorage.removeItem('token');
          this.router.navigate(['/login']);
        } else {
          this.message.error('Logout Failure:' + response.msg, {
            nzDuration: 2000
          });
        }
      }
    );
  }

}

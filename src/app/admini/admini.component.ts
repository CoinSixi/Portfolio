import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from '../api.service';
import {Portfolio} from '../entities/Portfolio';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-admini',
  templateUrl: './admini.component.html',
  styleUrls: ['./admini.component.css']
})
export class AdminiComponent implements OnInit {
  isCollapsed = false;
  username = window.localStorage.getItem('username');
  constructor(private router: Router, private api: ApiService, private message: NzMessageService) { }

  ngOnInit() {
  }

  select(num: number): void {
    if (num === 1) {
      this.router.navigate(['/administrator/fund-manager']);
    } else if (num === 2) {
      this.router.navigate(['/administrator/securities']);
    } else {
      this.router.navigate(['/administrator/portfolios']);
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

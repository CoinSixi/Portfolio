import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admini',
  templateUrl: './admini.component.html',
  styleUrls: ['./admini.component.css']
})
export class AdminiComponent implements OnInit {
  isCollapsed = false;
  username = window.localStorage.getItem('username');
  constructor(private router: Router) { }

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
    window.localStorage.removeItem('userId');
    window.localStorage.removeItem('role');
    window.localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

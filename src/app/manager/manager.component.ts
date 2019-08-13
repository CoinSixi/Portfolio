import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {
  isCollapsed = false;
  username = window.localStorage.getItem('username');
  constructor(private router: Router,) { }

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
    window.localStorage.removeItem('userId');
    window.localStorage.removeItem('role');
    window.localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}

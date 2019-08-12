import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {
  isCollapsed = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  select(num: number): void {
    if (num === 1) {
      this.router.navigate(['/manager/portfolios']);
    } else {
      this.router.navigate(['/manager/securities']);
    }
  }

}

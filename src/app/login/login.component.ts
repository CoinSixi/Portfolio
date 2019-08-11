import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  constructor(public router: Router) { }

  ngOnInit() {
  }

  signIn(): void {
    if (this.username === '1') {
      this.router.navigate(['/manager/portfolios']);
    } else {
      this.router.navigate(['/administrator/fund-manager']);
    }

  }
}

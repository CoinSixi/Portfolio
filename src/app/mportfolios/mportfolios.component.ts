import { Component, OnInit } from '@angular/core';
import {Portfolio} from '../entities/Portfolio';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs';

@Component({
  selector: 'app-mportfolios',
  templateUrl: './mportfolios.component.html',
  styleUrls: ['./mportfolios.component.css']
})
export class MportfoliosComponent implements OnInit {
  searchtext: string;
  portfolios: Portfolio[] = [
    {
      portfolioId: '1230131',
      portfolioName: 'HI',
      createTime: new Date(),
      updateTime: new Date(),
      userId: '256153',
      rating: 0.2
    }, {
      portfolioId: '1230151',
      portfolioName: 'HI5',
      createTime: new Date(),
      updateTime: new Date(),
      userId: '256553',
      rating: 0.13
    }, {
      portfolioId: '1238131',
      portfolioName: 'HI5',
      createTime: new Date(),
      updateTime: new Date(),
      userId: '25526153',
      rating: 0.14
    }, {
      portfolioId: '123049131',
      portfolioName: 'H151I',
      createTime: new Date(),
      updateTime: new Date(),
      userId: '256153',
      rating: 0.16
    }, {
      portfolioId: '123015661',
      portfolioName: 'HI15',
      createTime: new Date(),
      updateTime: new Date(),
      userId: '256153',
      rating: 0.17
    }, {
      portfolioId: '1230131',
      portfolioName: 'HI',
      createTime: new Date(),
      updateTime: new Date(),
      userId: '256153',
      rating: 0.2
    }, {
      portfolioId: '1230151',
      portfolioName: 'HI5',
      createTime: new Date(),
      updateTime: new Date(),
      userId: '256553',
      rating: 0.13
    }, {
      portfolioId: '1238131',
      portfolioName: 'HI5',
      createTime: new Date(),
      updateTime: new Date(),
      userId: '25526153',
      rating: 0.14
    }, {
      portfolioId: '123049131',
      portfolioName: 'H151I',
      createTime: new Date(),
      updateTime: new Date(),
      userId: '256153',
      rating: 0.16
    }, {
      portfolioId: '123015661',
      portfolioName: 'HI15',
      createTime: new Date(),
      updateTime: new Date(),
      userId: '256153',
      rating: 0.17
    }, {
      portfolioId: '1230131',
      portfolioName: 'HI',
      createTime: new Date(),
      updateTime: new Date(),
      userId: '256153',
      rating: 0.2
    }, {
      portfolioId: '1230151',
      portfolioName: 'HI5',
      createTime: new Date(),
      updateTime: new Date(),
      userId: '256553',
      rating: 0.13
    }, {
      portfolioId: '1238131',
      portfolioName: 'HI5',
      createTime: new Date(),
      updateTime: new Date(),
      userId: '25526153',
      rating: 0.14
    }, {
      portfolioId: '123049131',
      portfolioName: 'H151I',
      createTime: new Date(),
      updateTime: new Date(),
      userId: '256153',
      rating: 0.16
    }, {
      portfolioId: '123015661',
      portfolioName: 'HI15',
      createTime: new Date(),
      updateTime: new Date(),
      userId: '256153',
      rating: 0.17
    },
  ];

  showPortfolios: Portfolio[];
  isVisible = false;
  isConfirmLoading = false;
  validateForm: FormGroup;

  showModal2(): void {
    this.isVisible = true;

  }
  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  searchText(): void {
    const reg = '.*' + this.searchtext.toString();
    this.showPortfolios = this.portfolios.filter(portfolio => portfolio.portfolioId.match(reg));
  }


  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  userNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
          // you have to return `{error: true}` to mark it as an error event
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    })

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  }
  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      portfolioName: ['', [Validators.required]]
    });
    this.showPortfolios = this.portfolios;
  }

  ngOnInit() {
  }

}

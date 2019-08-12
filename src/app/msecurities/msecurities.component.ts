import { Component, OnInit } from '@angular/core';
import {Security} from '../entities/Security';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Portfolio} from '../entities/Portfolio';

@Component({
  selector: 'app-msecurities',
  templateUrl: './msecurities.component.html',
  styleUrls: ['./msecurities.component.css']
})
export class MsecuritiesComponent implements OnInit {

  searchtext: string;
  showSecurities: Security[];
  isVisible = false;
  isConfirmLoading = false;
  validateForm: FormGroup;
  securiries: Security[] = [
    {
      securityId: '13515',
      securityName: 'cndjcd',
      securityType: 'bonds',
      lastDay: new Date(2015, 8, 8),
      lastPrice: 12,
      today: null,
      todayPrice: 15,
    }, {
      securityId: '13515',
      securityName: 'csdjcd',
      securityType: 'bonds',
      lastDay: new Date(),
      lastPrice: 12,
      today: new Date(),
      todayPrice: 15,
    }, {
      securityId: '13515',
      securityName: 'cndsdvcd',
      securityType: 'bonds',
      lastDay: new Date(),
      lastPrice: 12,
      today: new Date(),
      todayPrice: 15,
    }, {
      securityId: '13515',
      securityName: 'cnfdvd',
      securityType: 'bonds',
      lastDay: new Date(),
      lastPrice: 12,
      today: new Date(),
      todayPrice: 15,
    }, {
      securityId: '13515',
      securityName: 'cnsscd',
      securityType: 'bonds',
      lastDay: new Date(),
      lastPrice: 12,
      today: new Date(),
      todayPrice: 15,
    }, {
      securityId: '13515',
      securityName: 'cndjdfgcd',
      securityType: 'bonds',
      lastDay: new Date(),
      lastPrice: 12,
      today: new Date(),
      todayPrice: 15,
    }, {
      securityId: '13515',
      securityName: 'cndjcd',
      securityType: 'bonds',
      lastDay: new Date(),
      lastPrice: 12,
      today: new Date(),
      todayPrice: 15,
    },
  ];
  portfolios: Portfolio[] = [/*
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
    },*/
  ];
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
      portfolio: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.showSecurities = this.securiries;
  }
  searchText(): void {
    const reg = '.*' + this.searchtext.toString();
    this.showSecurities = this.securiries.filter(portfolio => portfolio.securityName.match(reg));
  }

}

import { Component, OnInit } from '@angular/core';
import {Security} from '../entities/Security';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Portfolio} from '../entities/Portfolio';
import {ManagerService} from '../manager.service';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-msecurities',
  templateUrl: './msecurities.component.html',
  styleUrls: ['./msecurities.component.css']
})
export class MsecuritiesComponent implements OnInit {

  searchtext: string;
  equity: string;
  count: number;
  showSecurities: Security[];
  isVisible = false;
  isConfirmLoading = false;
  validateForm: FormGroup;
  selectSecurityId: string;
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
  portfolios: Portfolio[] = [];
  showModal2(securityId: string): void {
    this.selectSecurityId = securityId;
    this.getPortfolios();
    this.isVisible = true;
  }
  handleOk(): void {
    this.isVisible = false;
    this.isConfirmLoading = false;
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
  constructor(private fb: FormBuilder, private managerService: ManagerService, private message: NzMessageService) {
    this.validateForm = this.fb.group({
      portfolio: ['', [Validators.required]],
      count: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // this.getSecuritis();
    this.showSecurities = this.securiries;
  }
  searchText(): void {
    const reg = '.*' + this.searchtext.toString();
    this.showSecurities = this.securiries.filter(portfolio => portfolio.securityName.match(reg));
  }

  getSecuritis(): void {
    this.managerService.getSecurityList().subscribe(
      response => {
        if (response.code === 200 ) {
          console.log(response.data)
          this.securiries = response.data;
          this.showSecurities = response.data;
        } else {
          this.message.error('Get Failure:' + response.msg, {
            nzDuration: 10000
          });
        }
      }
    );
  }

  addSecuritis(): void {
    this.managerService.addSecurity(this.equity, this.selectSecurityId, this.count).subscribe(
      response => {
        console.log(response);
        if (response.code === 200 ) {
          this.getSecuritis();
          this.handleOk();
          this.message.success('Create Success!', {
            nzDuration: 10000
          });
        } else {
          this.message.error('Create Failure:' + response.msg, {
            nzDuration: 10000
          });
        }
      }
    );
  }
  getPortfolios(): void {
    this.managerService.getPortfoliosList().subscribe(
      response => {
        if (response.code === 200 ) {
          this.portfolios = response.data;
        } else {
        }
      }
    );
  }

}

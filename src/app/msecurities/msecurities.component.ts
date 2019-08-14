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
  isVisible = false;
  isConfirmLoading = false;
  validateForm: FormGroup;
  selectSecurityId: string;
  sortName: string | null = null;
  sortValue: string | null = null;
  searchAddress: string;
  listOfSearchName: string[] = [];
  listOfType = [{ text: 'equity', value: 'equity' }, { text: 'future', value: 'future' },
                { text: 'index', value: 'index' }, { text: 'commodity', value: 'commodity' },
                { text: 'fx', value: 'fx' }];
  listOfSearchAddress: string[] = [];
  mapOfSort: { [key: string]: any } = {
    securityId: null,
    securityName: null,
    securityType: null,
    lastDay: null,
    lastPrice: null,
    today: null,
    todayPrice: null,
    priceId: null
  };
  showSecurities: Security[];
  securiries: Security[];
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
    this.getSecuritis();
    this.getPortfolios();
    // this.showSecurities = this.securiries;
  }
  searchText(): void {
    const reg = '.*' + this.searchtext.toString();
    this.showSecurities = this.securiries.filter(portfolio => portfolio.securityName.match(reg));
  }

  getSecuritis(): void {
    this.managerService.getSecurityList().subscribe(
      response => {
        if (response.code === 200 ) {
          this.securiries = response.data;
          this.showSecurities = response.data;
        } else {
          this.message.error('Get Failure:' + response.msg, {
            nzDuration: 2000
          });
        }
      }
    );
  }

  addPosion(): void {
    const portfolioId = this.portfolios.filter(item => item.portfolioName === this.equity)[0].portfolioId;
    this.managerService.addPosition(portfolioId, this.selectSecurityId, this.count).subscribe(
      response => {
        if (response.code === 200 ) {
          this.equity = '';
          this.count = 0;
          this.handleOk();
          this.filter(this.listOfSearchName, '');
          this.message.success('Create Success!', {
            nzDuration: 2000
          });
        } else {
          this.message.error('Create Failure:' + response.msg, {
            nzDuration: 2000
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
  filter(listOfSearchName: string[], searchAddress: string): void {
    this.listOfSearchName = listOfSearchName;
    this.searchAddress = searchAddress;
    // this.search();
    console.log(listOfSearchName);
    console.log(searchAddress);
    this.showSecurities = this.securiries.filter(item => {
      for ( const i of listOfSearchName) {
        if (item.securityType === i) {
          return true;
        }
      }
      return  false;
    });
    console.log(this.showSecurities);
  }
  sort(sortName: string, value: string): void {
    this.sortName = sortName;
    this.sortValue = value;
    for (const key in this.mapOfSort) {
      this.mapOfSort[key] = key === sortName ? value : null;
    }
    this.search(this.listOfSearchName, this.listOfSearchAddress);
  }
  search(listOfSearchName: string[], listOfSearchAddress: string[]): void {
    this.listOfSearchName = listOfSearchName;
    this.listOfSearchAddress = listOfSearchAddress;
    console.log(this.listOfSearchAddress);
    const filterFunc = (item: Security) =>
      (this.listOfSearchAddress.length
        ? this.listOfSearchAddress.some(address => item.securityType.indexOf(address) !== -1)
        : true);
    const listOfData = this.showSecurities.filter((item: Security) => filterFunc(item));
    console.log(listOfData);
    if (this.sortName && this.sortValue) {
      this.showSecurities = listOfData.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    } else {
      this.showSecurities = listOfData;
    }
  }

}

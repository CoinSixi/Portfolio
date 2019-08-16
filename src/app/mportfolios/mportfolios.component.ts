import { Component, OnInit } from '@angular/core';
import {Portfolio} from '../entities/Portfolio';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs';
import {ManagerService} from '../manager.service';
import { NzMessageService } from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {Position} from '../entities/Position';
@Component({
  selector: 'app-mportfolios',
  templateUrl: './mportfolios.component.html',
  styleUrls: ['./mportfolios.component.css']
})
export class MportfoliosComponent implements OnInit {
  searchtext = '';
  portfolioName: string;
  portfolios: Portfolio[] = [];

  showPortfolios: Portfolio[];
  isVisible = false;
  isConfirmLoading = false;
  validateForm: FormGroup;
  sortName: string | null = null;
  sortValue: string | null = null;
  listOfSearchName: string[] = [];
  listOfSearchAddress: string[] = [];
  mapOfSort: { [key: string]: any } = {
    portfolioId: null,
    portfolioName: null,
    createTime: null,
    updateTime: null,
    userName: null,
    rateDay: null,
    rateTotal: null
  };
  showModal2(): void {
    this.isVisible = true;

  }
  handleOk(): void {
    this.isVisible = false;
    this.isConfirmLoading = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  searchText(): void {
    const reg = '.*' + this.searchtext;
    this.showPortfolios = this.portfolios.filter(portfolio => portfolio.portfolioName.match(reg));
  }

  getPortfolios(): void {
    this.managerService.getPortfoliosList().subscribe(
      response => {
        if (response.code === 200 ) {
          console.log(response.data)
          this.portfolios = response.data;
          this.showPortfolios = response.data;
          this.searchText();
        } else {
          this.message.error('Get Failure:' + response.msg);
        }
      }
    );
  }

  addPortfolio(): void {

    this.managerService.addPortFolio(this.portfolioName).subscribe(
      response => {
        console.log(response);
        if (response.code === 200 ) {
          const port: Portfolio = response.data;
          this.getPortfolios();
          this.handleOk();
          this.message.success('Create Success!');
        } else {
          this.message.error('Create Failure:' + response.msg);
        }
        this.portfolioName = '';
      }
    );
  }

  deletePortfolio(portfolioId: string): void {
    this.managerService.deletePortFolio(portfolioId).subscribe(
      response => {
        console.log(response);
        if (response.code === 200 ) {
          const port: Portfolio = response.data;
          this.getPortfolios();
          this.message.success('Delete Success!');
        } else {
          this.message.error('Delete Failure:' + response.msg);
        }
        this.portfolioName = '';
      }
    );
  }
  goDeatil(portfolio: Portfolio): void {
    console.log(portfolio);
    this.router.navigate(['/manager/portfolio'], {queryParams: {portfolioId: portfolio.portfolioId,
        portfolioName: portfolio.portfolioName, rateTotal: portfolio.rateTotal, manager: portfolio.userName, basePrice: portfolio.basePrice}});
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
    const filterFunc = (item: Portfolio) =>
      (this.listOfSearchAddress.length
        ? this.listOfSearchAddress.some(address => item.address.indexOf(address) !== -1)
        : true) &&
      (this.listOfSearchName.length ? this.listOfSearchName.some(name => item.name.indexOf(name) !== -1) : true);
    const listOfData = this.portfolios.filter((item: Portfolio) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.showPortfolios = listOfData.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    } else {
      this.showPortfolios = listOfData;
    }
  }
  constructor(private fb: FormBuilder, private managerService: ManagerService, private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
      portfolioName: ['', [Validators.required]]
    });
    // this.showPortfolios = this.portfolios;
    this.getPortfolios();
  }

  ngOnInit() {
  }

}

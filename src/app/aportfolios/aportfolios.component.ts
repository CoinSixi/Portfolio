import { Component, OnInit } from '@angular/core';
import { Portfolio} from '../entities/Portfolio';
import {ApiService} from '../api.service';
import {Security} from '../entities/Security';
import {Router} from '@angular/router';

@Component({
  selector: 'app-aportfolios',
  templateUrl: './aportfolios.component.html',
  styleUrls: ['./aportfolios.component.css']
})
export class AportfoliosComponent implements OnInit {

  searchtext: string;
  portfolios: Portfolio[] = [];

  showPortfolios: Portfolio[];
  searchRating: string;
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
  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {
    this.api.getportfolios().subscribe(
      response => {
        if (response.code === 200 ) {
          this.portfolios = response.data;
          this.showPortfolios = this.portfolios;
          console.log(this.showPortfolios);
          console.log( 'get portfolios success！');
        } else {
          console.error( 'get portfolios error!');
        }
      });
  }

  searchText(): void {
    const reg = '.*' + this.searchtext.toString();
    this.showPortfolios = this.portfolios.filter(portfolio => portfolio.portfolioName.match(reg));
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

  goDeatil(portfolio: Portfolio): void {
    console.log(portfolio);
    this.router.navigate(['/administrator/portfolio'], {queryParams: {portfolioId: portfolio.portfolioId, portfolioName: portfolio.portfolioName, rateTotal: portfolio.rateTotal, manager: portfolio.userName}});
  }
}

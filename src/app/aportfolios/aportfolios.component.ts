import { Component, OnInit } from '@angular/core';
import { Portfolio} from '../entities/Portfolio';

@Component({
  selector: 'app-aportfolios',
  templateUrl: './aportfolios.component.html',
  styleUrls: ['./aportfolios.component.css']
})
export class AportfoliosComponent implements OnInit {

  searchtext: string;
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

  showPortfolios: Portfolio[];
  sortName: string | null = null;
  sortValue: string | null = null;
  searchRating: string;
  listOfSearchName: string[] = [];
  constructor() { }

  ngOnInit() {
    this.showPortfolios = this.portfolios;
  }

  searchText(): void {
    const reg = '.*' + this.searchtext.toString();
    this.showPortfolios = this.portfolios.filter(portfolio => portfolio.portfolioName.match(reg));
  }
  sort(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.search();
  }

  filter(listOfSearchName: string[], searchRating: string): void {
    this.listOfSearchName = listOfSearchName;
    this.searchRating = searchRating;
    this.search();
  }
  search(): void {
    const data = this.portfolios;
    if (this.sortName && this.sortValue) {
      this.showPortfolios = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    } else {
      this.showPortfolios = data;
    }
  }
}

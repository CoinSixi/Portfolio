import { Component, OnInit } from '@angular/core';
import { Portfolio} from '../entities/Portfolio';
import {ApiService} from '../api.service';

@Component({
  selector: 'app-aportfolio',
  templateUrl: './aportfolio.component.html',
  styleUrls: ['./aportfolio.component.css']
})
export class AportfolioComponent implements OnInit {

  searchtext: string;
  portfolios: Portfolio[] = [];

  showPortfolios: Portfolio[];
  sortName: string | null = null;
  sortValue: string | null = null;
  searchRating: string;
  listOfSearchName: string[] = [];
  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getportfolios().subscribe(
      response => {
        if (response.code === 200 ) {
          this.portfolios = response.data;
          this.showPortfolios = this.portfolios;
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

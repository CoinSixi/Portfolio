import {Component, ElementRef, OnInit} from '@angular/core';
import { Position} from '../entities/Position';
import {ActivatedRoute} from '@angular/router';
import {Portfolio} from '../entities/Portfolio';
import {ManagerService} from '../manager.service';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-aportfolio',
  templateUrl: './aportfolio.component.html',
  styleUrls: ['./aportfolio.component.css']
})
export class AportfolioComponent implements OnInit {

  title = 'app';
  data = {};
  editCache: { [key: string]: any } = {};
  portfolio: Portfolio = new Portfolio();
  positions: Position[] = [];
  showPositions: Position[];
  sortName: string | null = null;
  sortValue: string | null = null;
  searchAddress: string;
  listOfSearchName: string[] = [];
  listOfSearchAddress: string[] = [];
  listOfType = [{ text: 'equity', value: 'equity' }, { text: 'future', value: 'future' },
    { text: 'index', value: 'index' }, { text: 'commodity', value: 'commodity' },
    { text: 'fx', value: 'fx' }];
  mapOfSort: { [key: string]: any } = {
    positionId: null,
    portfolioId: null,
    securityId: null,
    securityName: null,
    securityType: null,
    quantity: null,
    price: null,
    rateTotal: null,
  };

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }
  constructor(public activatedRouter: ActivatedRoute,
              private managerService: ManagerService,
              private message: NzMessageService) { }

  ngOnInit() {
    this.portfolio.portfolioId = this.activatedRouter.snapshot.queryParams.portfolioId;
    this.portfolio.portfolioName = this.activatedRouter.snapshot.queryParams.portfolioName;
    this.getPositions();
    // this.pieChart();
  }

  updatePosition(positionId: string): void {
    console.log(this.editCache[positionId].data.quantity);
    this.managerService.updatePosition(positionId, this.editCache[positionId].data.quantity).subscribe(
      response => {
        if (response.code === 200 ) {
          const port: Portfolio = response.data;
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

  getPositions(): void {
    this.managerService.getPositions(this.portfolio.portfolioId).subscribe(
      response => {
        if (response.code === 200 ) {
          console.log(response.data);
          this.positions = response.data;
          this.showPositions = this.positions;
          // this.chartData();
        } else {
          this.message.error('Get Failure:' + response.msg, {
            nzDuration: 10000
          });
        }
      }
    );
  }

  filter(listOfSearchName: string[], searchAddress: string): void {
    this.listOfSearchName = listOfSearchName;
    this.searchAddress = searchAddress;
    // this.search();
    console.log(listOfSearchName);
    console.log(this.positions);
    if (this.listOfSearchName.length > 0) {
      this.showPositions = this.positions.filter(item => {
        for ( const i of listOfSearchName) {
          if (item.securityType === i) {
            return true;
          }
        }
        return  false;
      });
    }
    console.log(this.showPositions);
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
    const filterFunc = (item: Position) =>
      (this.listOfSearchAddress.length
        ? this.listOfSearchAddress.some(address => item.securityType.indexOf(address) !== -1)
        : true);
    const listOfData = this.showPositions.filter((item: Position) => filterFunc(item));
    console.log(listOfData);
    if (this.sortName && this.sortValue) {
      this.showPositions = listOfData.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    } else {
      this.showPositions = listOfData;
    }
  }
}

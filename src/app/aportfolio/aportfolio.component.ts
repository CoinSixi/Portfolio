import {Component, ElementRef, OnInit} from '@angular/core';
import { Position} from '../entities/Position';
import {ActivatedRoute} from '@angular/router';
import {Portfolio} from '../entities/Portfolio';
import {ManagerService} from '../manager.service';
import {NzMessageService} from 'ng-zorro-antd';
import {ApiService} from '../api.service';
import {fromEvent} from 'rxjs';
import * as echarts from 'echarts';
import {DatePipe} from '@angular/common';

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
  eChartDatas: any;
  chartOption: any;
  resize = (document.body.clientHeight - 181) + 'px';
  app = {};
  option = null;
  priceDate = new Date();
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }
  fetchData() {
    this.api.getHistoryPrice(this.portfolio.portfolioId).subscribe(
      response => {
        if (response.code === 200) {
          this.eChartDatas = response.data;
          this.showChart();
          this.eChartDatas.forEach(tuple => {
            this.priceDate = tuple.date;
            // console.log('eChartDatas==' + this.priceDate );
            this.chartOption.xAxis[0].data.push(this.datePipe.transform(this.priceDate, 'yyyy-MM-dd'));
            this.chartOption.series[0].data.push(tuple.price);
          });
        } else {
          return;
        }
      }
    );
  }
  showChart() {
    this.chartOption = {
      title: {
        text: 'Total Price Trend',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 16,
          color: '#2c3e50'
        },
        left: '45%'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          lineStyle: {
            color: '#2c3e50'
          }
        }
      }/*,
      legend: {
        icon: 'rect',
        itemWidth: 14,
        itemHeight: 5,
        itemGap: 13,
        data: [this.portfolio.portfolioName],
        right: '4%',
        textStyle: {
          fontSize: 12,
          color: '#F1F1F3'
        }
      }*/,
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        name: 'Date',
        nameLocation: 'center',
        nameGap: 18,
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#2c3e50'
          }
        },

        nameTextStyle: {
          fontStyle: 'normal',
          fontWeight: 'bold',
          color: '#2c3e50'
        },
        boundaryGap: false,
        data: [],
      }],
      yAxis: [{
        type: 'value',
        name: 'Price',
        axisTick: {
          show: false
        },
        nameTextStyle: {
          fontStyle: 'normal',
          fontWeight: 'bold',
          color: '#2c3e50'
        },
        // min: 'dataMin',
        scale: true,
        axisLine: {
          lineStyle: {
            color: '#2c3e50'
          }
        },
        axisLabel: {
          margin: 10,
          textStyle: {
            fontSize: 14
          }
        },
        splitLine: {
          lineStyle: {
            color: '#e5e5e5'
          }
        }
      }],
      series: [ {
        name: 'Total Price',
        type: 'line',
        smooth: true,
        lineStyle: {
          normal: {
            width: 1
          }
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#1890ff'
            }, {
              offset: 0.8,
              color: 'rgba(219, 50, 51, 0)'
            }], false),
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 10
          }
        },
        itemStyle: {
          normal: {
            color: '#1890ff'
          }
        },
        data: []
      }, ]
    };
  }

  constructor(public activatedRouter: ActivatedRoute,
              private managerService: ManagerService,
              private message: NzMessageService,
              private api: ApiService,
              private datePipe: DatePipe) { }

  ngOnInit() {
    this.portfolio.portfolioId = this.activatedRouter.snapshot.queryParams.portfolioId;
    this.portfolio.portfolioName = this.activatedRouter.snapshot.queryParams.portfolioName;
    this.portfolio.rateTotal = this.activatedRouter.snapshot.queryParams.rateTotal;
    this.portfolio.userName = this.activatedRouter.snapshot.queryParams.manager;
    this.getPositions();
    fromEvent(window, 'resize')
      .subscribe(() => echarts.resize());
    this.fetchData();
    // this.pieChart();
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

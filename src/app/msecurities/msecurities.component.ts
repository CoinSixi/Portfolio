import { Component, OnInit } from '@angular/core';
import {Security} from '../entities/Security';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Portfolio} from '../entities/Portfolio';
import {ManagerService} from '../manager.service';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';
import {DatePipe} from '@angular/common';
import * as echarts from 'echarts';
import {ApiService} from '../api.service';

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

  isVisible2 = false;
  isConfirmLoading2 = false;
  eChartDatas: any;
  chartOption: any;
  resize = (document.body.clientHeight - 181) + 'px';
  app = {};
  option = null;
  priceDate = new Date();

  select: Security = new Security();
  showModal2(securityId: string): void {
    this.selectSecurityId = securityId;
    this.getPortfolios();
    this.isVisible = true;
  }
  showModal4(select: Security): void {
    this.isVisible2 = true;
    this.select = select;
    this.fetchData();
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

  constructor(private fb: FormBuilder, private managerService: ManagerService, private message: NzMessageService, private datePipe: DatePipe, private api: ApiService,) {
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
          this.equity = null;
          this.count = null;
          this.handleOk();
          this.filter(this.listOfSearchName.length !== 0 ? this.listOfSearchName : ['equity', 'fx', 'commodity', 'index', 'future'], '');
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
  fetchData() {
    console.log('get');
    this.api.getHistorySecurity(this.select.securityId).subscribe(
      response => {
        if (response.code === 200) {
          console.log(response);
          this.eChartDatas = response.data;
          this.showChart();
          this.eChartDatas.forEach(tuple => {
            this.priceDate = tuple.date;
            // console.log('eChartDatas==' + this.priceDate );
            this.chartOption.xAxis[0].data.push(this.datePipe.transform(this.priceDate, 'yyyy-MM-dd'));
            this.chartOption.series[0].data.push(tuple.value);
          });
        } else {
          return;
        }
      }
    );
  }
  showChart() {
    // @ts-ignore
    this.chartOption = {
      title: {
        text: this.select.securityName + ' Price Trend',
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
      },
      /*legend: {
        icon: 'rect',
        itemWidth: 14,
        itemHeight: 5,
        itemGap: 13,
        data: [this.select.securityName],
        right: '4%',
        textStyle: {
          fontSize: 12,
          color: '#F1F1F3'
        }
      },*/
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#2c3e50'
          }
        },
        nameTextStyle: {
          fontStyle: 'normal',
          fontWeight: 'bold',
          color: '#2c3e50'
        },
        data: [],
      }],
      yAxis: [{
        type: 'value',
        axisTick: {
          show: false
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
        },
      }],
      series: [ {
        name: 'Price',
        type: 'line',
        smooth: true,
        lineStyle: {
          normal: {
            color: '#1890ff',
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
              color: 'rgba(255, 255, 255, 0.3)'
            }], false),
            /*shadowColor: 'rgba(0, 0, 0, 0)',
            shadowBlur: 0*/
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

}

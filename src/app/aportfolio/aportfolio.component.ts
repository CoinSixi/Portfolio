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
import {Security} from '../entities/Security';

@Component({
  selector: 'app-aportfolio',
  templateUrl: './aportfolio.component.html',
  styleUrls: ['./aportfolio.component.css']
})
export class AportfolioComponent implements OnInit {

  ttitle = 'app';
  data = {};
  chart ;
  dateType = 1;

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
  mapOfSort2: { [key: string]: any } = {
    positionId: null,
    portfolioId: null,
    securityId: null,
    securityName: null,
    securityType: null,
    quantity: null,
    price: null,
    rateTotal: null,
  };
  select: Security = new Security();
  eChartDatas: any;
  eChartDatas2: any;
  lineChartOption: any;
  chartOption2: any;
  resize = (document.body.clientHeight - 181) + 'px';
  app = {};
  myPieChart: any;
  myBarhart: any;
  myLineChart: any;
  option = null;
  mapArray = [];
  pieOption: any;
  barOption: any;
  priceDate = new Date();
  showModal4(select: Security): void {
    this.select = select;
    this.fetchData2();
  }
  fetchData() {
    this.api.getHistoryPriceByDate(this.portfolio.portfolioId, this.dateType).subscribe(
      response => {
        if (response.code === 200) {
          this.eChartDatas = response.data;
          this.getLineChartOption();
          this.eChartDatas.forEach(tuple => {
            this.priceDate = tuple.date;
            this.lineChartOption.xAxis[0].data.push(this.datePipe.transform(this.priceDate, 'yyyy-MM-dd'));
            this.lineChartOption.series[0].data.push(tuple.price);
          });
          this.showLineChart();
        } else {
          return;
        }
      }
    );
  }
  showLineChart() {
    this.myLineChart = echarts.init(document.getElementById('lineContainer') as HTMLDivElement);
    this.myLineChart.setOption(this.lineChartOption);
    console.log('aaaaa:', this.lineChartOption.series[0].data);
  }
  getLineChartOption() {
    this.lineChartOption = {
      title: {
        text: 'Total Price Trend',
        left: 'center',
        top: 10,
        bottom: 10,
        textStyle: {
          color: '#2c3e50'
        }
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
              color: '#3398DB'
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
            color: '#3398DB'
          }
        },
        data: []
      }, ]
    };
  }
  getBarChartOption() {
    this.barOption = {
      color: ['#3398DB'],
      title: {
        text: 'Quantity Chart',
        left: 'center',
        top: 10,
        bottom: 10,
        textStyle: {
          color: '#2c3e50'
        }
      },
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '0%',
        bottom: '3%',
        containLabel: true
      },
      xAxis : [
        {
          type : 'category',
          data : [],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis : [
        {
          type : 'value'
        }
      ],
      series : [
        {
          name: 'quantity',
          type: 'bar',
          barWidth: '60%',
          data: []
        }
      ]
    };
  }
  showPositionPieAndBarChart(): void {
    this.getPieChartOption();
    this.getBarChartOption();
    this.positions.forEach(tuple => {
      const mapPie: {[key: string]: any} = {
        name: null,
        value: null,
      };
      mapPie.name = tuple.securityName;
      mapPie.value = tuple.quantity * tuple.price;
      this.mapArray.push(mapPie);
      this.barOption.xAxis[0].data.push(tuple.securityName);
      this.barOption.series[0].data.push(tuple.quantity);
    });
    this.myPieChart = echarts.init(document.getElementById('pieContainer') as HTMLDivElement);
    this.myBarhart = echarts.init(document.getElementById('barContainer') as HTMLDivElement);
    this.pieOption.series[0].data = this.mapArray;
    this.myPieChart.setOption(this.pieOption);
    console.log('aaaaa:', this.barOption.series[0].data);
    this.myBarhart.setOption(this.barOption);
  }
  getPieChartOption() {
    this.pieOption = {
      title: {
        text: 'Position Pie',
        left: 'center',
        top: 10,
        bottom: 10,
        textStyle: {
          color: '#2c3e50'
        }
      },
      legend: {
        icon: 'rect',
        data: [this.portfolio.portfolioName],
        right: '4%',
        textStyle: {
          fontSize: 12,
          color: '#F1F1F3'
        }
      },
      tooltip : {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },

      visualMap: {
        show: false,
        min: 0,
        max: 100000,
        inRange: {
          colorLightness: [0.3, 0.8]
        }
      },
      series : [
        {
          name: 'Security Name',
          type: 'pie',
          radius : '55%',
          center: ['50%', '50%'],
          data: [].sort( (a, b) => a.value - b.value),
          label: {
            normal: {
              textStyle: {
                color: 'rgba(0, 0, 0, 0.3)'
              }
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: 'rgba(0, 0, 0, 0.3)'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            }
          },
          itemStyle: {
            normal: {
              color: '#3398DB',
            },
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 10
          },

          animationType: 'scale',
          animationEasing: 'elasticOut',
          /*animationDelay: function (idx) {
            return Math.random() * 200;
          }*/
        }
      ]
    };

  }
  fetchData2() {
    this.api.getHistorySecurity(this.select.securityId).subscribe(
      response => {
        if (response.code === 200) {
          console.log(response);
          this.eChartDatas2 = response.data;
          this.showChart2();
          this.eChartDatas2.forEach(tuple => {
            this.priceDate = tuple.date;
            // console.log('eChartDatas==' + this.priceDate );
            this.chartOption2.xAxis[0].data.push(this.datePipe.transform(this.priceDate, 'yyyy-MM-dd'));
            this.chartOption2.series[0].data.push(tuple.value);
          });
        } else {
          return;
        }
      }
    );
  }
  showChart2() {
    // @ts-ignore
    this.chartOption2 = {
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
  constructor(public activatedRouter: ActivatedRoute,
              private managerService: ManagerService,
              private message: NzMessageService,
              private api: ApiService,
              private datePipe: DatePipe) { }

  ngOnInit() {
    this.portfolio.portfolioId = this.activatedRouter.snapshot.queryParams.portfolioId;
    this.portfolio.portfolioName = this.activatedRouter.snapshot.queryParams.portfolioName;
    this.portfolio.rateTotal = this.activatedRouter.snapshot.queryParams.rateTotal;
    this.portfolio.userName = this.activatedRouter.snapshot.queryParams.userName;
    this.getPositions();
    fromEvent(window, 'resize')
      .subscribe(() => echarts.resize());
    // this.pieChart();
  }

  getPositions(): void {
    this.managerService.getPositions(this.portfolio.portfolioId).subscribe(
      response => {
        if (response.code === 200 ) {
          console.log(response.data);
          this.positions = response.data;
          this.showPositions = this.positions;
          console.log(this.positions);
          this.fetchData();
          this.showPositionPieAndBarChart();
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

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
  selector: 'app-mportfolio',
  templateUrl: './mportfolio.component.html',
  styleUrls: ['./mportfolio.component.css']
})
export class MportfolioComponent implements OnInit {

  title = 'app';
  data = {};
  chart ;
  graph;

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
  myPieChart: any;
  option = null;
  mapArray = [];
  pieOption: any;
  priceDate = new Date();
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
  showPositionPie(): void {
    this.managerService.getPositions(this.portfolio.portfolioId).subscribe(
      response => {
        if (response.code === 200 ) {
          // console.log(response.data);
          this.positions = response.data;
          this.positions.forEach(tuple => {
            const mapPie: {[key: string]: any} = {
              name: null,
              value: null,
            };
            mapPie.name = tuple.securityName;
            mapPie.value = tuple.quantity * tuple.price;
            this.mapArray.push(mapPie);
          });
          this.getPieChart();
          this.myPieChart = echarts.init(document.getElementById('pieContainer') as HTMLDivElement);
          this.pieOption.series[0].data = this.mapArray;
          console.log('aa', this.pieOption.series[0].data);
          this.myPieChart.setOption(this.pieOption);
        } else {
          console.error('获取饼图数据失败');
        }
      }
    );
  }
  /*getPieChart() {
    this.pieOption = {
      title: {
        text: 'Position Pie',
        left: '40%',
        top: 20,
        textStyle: {
          color: '#2c3e50'
        }
      },
      tooltip : {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
          colorLightness: [0, 1]
        }
      },
      series : [
        {
          name: 'Security Name',
          type: 'pie',
          data: [].sort( (a, b) => a.value - b.value),
          roseType: 'radius',
          clockwise: true,
          label: {
            normal: {
              textStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }
          },
          itemStyle: {
            normal: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'red' // 0% 处的颜色
                }, {
                  offset: 1, color: 'blue' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          }
        }
      ]
    };
  }*/
  getPieChart() {
    this.pieOption = {
      title: {
        text: 'Position Pie',
        left: '6%',
        top: 20,
        textStyle: {
          color: '#ccc'
        }
      },

      tooltip : {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },

      visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
          colorLightness: [0, 1]
        }
      },
      series : [
        {
          name: 'Security Name',
          type: 'pie',
          radius : '55%',
          center: ['50%', '50%'],
          data: [].sort( (a, b) => a.value - b.value),
          roseType: 'radius',
          label: {
            normal: {
              textStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            }
          },
          itemStyle: {
            normal: {
              color: '#c23531',
            }
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

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.positions.findIndex(item => item.positionId === id);
    this.editCache[id] = {
      data: { ...this.positions[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    const index = this.positions.findIndex(item => item.positionId === id);
    Object.assign(this.positions[index], this.editCache[id].data);
    this.editCache[id].edit = false;
    this.updatePosition(id);
  }

  updateEditCache(): void {
    this.positions.forEach(item => {
      this.editCache[item.positionId] = {
        edit: false,
        data: { ...item }
      };
    });
    console.log(this.editCache);
  }

  constructor(public activatedRouter: ActivatedRoute,
              private managerService: ManagerService,
              private message: NzMessageService,
              private api: ApiService,
              private datePipe: DatePipe) { }

  ngOnInit() {
    this.portfolio.portfolioId = this.activatedRouter.snapshot.queryParams.portfolioId;
    this.portfolio.portfolioName = this.activatedRouter.snapshot.queryParams.portfolioName;
    this.getPositions();
    fromEvent(window, 'resize')
      .subscribe(() => echarts.resize());
    this.fetchData();
    this.showPositionPie();
    // this.pieChart();
  }

  updatePosition(positionId: string): void {
    console.log(this.editCache[positionId].data.quantity);
    this.managerService.updatePosition(positionId, this.editCache[positionId].data.quantity).subscribe(
      response => {
        if (response.code === 200 ) {
          const port: Portfolio = response.data;
          this.getPositions();
          this.message.success('Update Success!', {
            nzDuration: 2000
          });
        } else {
          this.message.error('Update Failure:' + response.msg, {
            nzDuration: 2000
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
          this.updateEditCache();
          // this.chartData();
        } else {
          this.message.error('Get Failure:' + response.msg, {
            nzDuration: 10000
          });
        }
      }
    );
  }

  deletePosition(positionId: string): void {
    this.managerService.deletePosition(positionId).subscribe(
      response => {
        console.log(response);
        if (response.code === 200 ) {
          const port: Portfolio = response.data;
          this.positions = this.positions.filter(item => item.positionId !== positionId);
          this.showPositions = this.positions;
          this.filter(this.listOfSearchName.length !== 0 ? this.listOfSearchName : ['equity', 'fx', 'commodity', 'index', 'future'], '');
          this.message.success('Delete Success!', {
            nzDuration: 10000
          });
        } else {
          this.message.error('Delete Failure:' + response.msg, {
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

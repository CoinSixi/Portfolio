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
  option = null;
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
      backgroundColor: '#394056',
      title: {
        text: 'Total Price Trend',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 16,
          color: '#F1F1F3'
        },
        left: '6%'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          lineStyle: {
            color: '#57617B'
          }
        }
      },
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
      },
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
            color: '#57617B'
          }
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
            color: '#57617B'
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
            color: '#57617B'
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
              color: 'rgba(219, 50, 51, 0.3)'
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
            color: 'rgb(219,50,51)'
          }
        },
        data: []
      }, ]
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
    // this.pieChart();
  }

  updatePosition(positionId: string): void {
    console.log(this.editCache[positionId].data.quantity);
    this.managerService.updatePosition(positionId, this.editCache[positionId].data.quantity).subscribe(
      response => {
        if (response.code === 200 ) {
          const port: Portfolio = response.data;
          this.getPositions();
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
  /*chartData() {
    const data = [
      { weekday: 'Mon', bugnum: 100 },
      { weekday: 'Tue', bugnum: 120 },
      { weekday: 'Wed', bugnum: 130 },
      { weekday: 'Thu', bugnum: 160 },
      { weekday: 'Fri', bugnum: 150 },
      { weekday: 'Sat', bugnum: 190 },
      { weekday: 'Sun', bugnum: 210 }
    ];
    const chart = new G2.Chart({
      container: 'c1', // 指定图表容器 ID
      width : 600, // 指定图表宽度
      height : 300 // 指定图表高度
    });
    chart.source(data);
    chart.interval().position('weekday*bugnum').color('weekday');
    chart.render();
    /!*const crosshairs =  {
      // rect 	表示矩形框，
      // x 		表示水平辅助线，
      // y|line  	【默认】表示垂直辅助线
      // cross 	表示十字辅助线
      type: 'line'
    };
    this.chart.source(this.positions);
    this.chart.scale('positionId', {
      min: 0
    });
    this.chart.scale('quantity', {
      range: [0, 1]
    });
    this.chart.tooltips = crosshairs;
    this.chart.line().position('positionId*quantity');
    this.chart.point().position('positionId*quantity').size(2).shape('circle').style({
      stroke: '#fff',
      lineWidth: 1
    });
    //  渲染图表
    this.chart.render();*!/
  }
  pieChart(): void {
   /!* const data = [{
      type: '评估中',
      percent: 0.23
    }, {
      type: '设计中',
      percent: 0.28
    }, {
      type: '正在开发',
      percent: 0.30
    }, {
      type: '已上线',
      percent: 0.19
    }];

    const chart = new G2.Chart({
      container: 'mountNode',
      forceFit: true,
      height: window.innerHeight,
      padding: 'auto'
    });
    chart.source(data);
    chart.tooltip(false);
    chart.legend('gender', {
      position: 'right-center',
      offsetX: -100
    });
    chart.coord('theta', {
      radius: 0.75,
      innerRadius: 0.6
    });
    chart.intervalStack().position('percent').color('type', ['#0a7aca', '#0a9afe', '#4cb9ff', '#8ed1ff']).opacity(1).label('percent', {
      offset: -18,
      textStyle: {
        fill: 'white',
        fontSize: 12,
        shadowBlur: 2,
        shadowColor: 'rgba(0, 0, 0, .45)'
      },
      rotate: 0,
      autoRotate: false,
      formatter: function formatter(text, item) {
        return String(String(item.point.percent * 100)) + '%';
      }
    });
    chart.guide().html({
      position: ['50%', '50%'],
      html: '<div class="g2-guide-html"><p class="title">项目总计</p><p class="value">500</p></div>'
    });

    chart.on('interval:mouseenter', click(ev));

    chart.on('interval:mouseleave', function() {
      const el: ElementRef;
      el.nativeElement.querySelector('.g2-guide-html .title').text('项目总计');
      el.nativeElement.querySelector('.g2-guide-html .value').text(500);
    });
    chart.render();*!/

  }*/
}

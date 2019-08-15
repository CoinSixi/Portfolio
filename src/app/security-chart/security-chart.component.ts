import {Component, OnInit, Input} from '@angular/core';
import {fromEvent} from 'rxjs';
import * as echarts from 'echarts';
import {DatePipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {ManagerService} from '../manager.service';
import {NzMessageService} from 'ng-zorro-antd';
import {ApiService} from '../api.service';
import {Security} from '../entities/Security';
@Component({
  selector: 'app-security-chart',
  templateUrl: './security-chart.component.html',
  styleUrls: ['./security-chart.component.css']
})
export class SecurityChartComponent implements OnInit {


  eChartDatas: any;
  chartOption: any;
  resize = (document.body.clientHeight - 181) + 'px';
  app = {};
  option = null;
  priceDate = new Date();
  @Input() security: Security = new Security();
  fetchData() {
    console.log('get');
    this.api.getHistorySecurity(this.security.securityId).subscribe(
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
    this.chartOption = {
      backgroundColor: '#394056',
      title: {
        text: 'Security Price Trend',
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
        data: [this.security.securityName],
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
        name: 'Price',
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
  constructor(public activatedRouter: ActivatedRoute,
              private managerService: ManagerService,
              private message: NzMessageService,
              private api: ApiService,
              private datePipe: DatePipe) {
  }

  ngOnInit() {
    console.log(this.security);
    fromEvent(window, 'resize')
      .subscribe(() => echarts.resize());
    this.fetchData();
  }

}

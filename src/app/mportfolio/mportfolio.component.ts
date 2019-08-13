import {Component, ElementRef, OnInit} from '@angular/core';
import { Position} from '../entities/Position';
import {ActivatedRoute} from '@angular/router';
import {Portfolio} from '../entities/Portfolio';
import {ManagerService} from '../manager.service';
import {NzMessageService} from 'ng-zorro-antd';

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
    alert(id);
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
          this.positions.filter(portfolio => portfolio.positionId !== positionId);
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
  chartData() {
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
    /*const crosshairs =  {
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
    this.chart.render();*/
  }
  pieChart(): void {
   /* const data = [{
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
    chart.render();*/

  }
}

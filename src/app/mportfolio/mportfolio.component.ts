import { Component, OnInit } from '@angular/core';
import { Position} from '../entities/Position';
import {User} from '../entities/User';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Portfolio} from '../entities/Portfolio';
import {F2} from 'codelyzer/util/function';
import {ManagerService} from '../manager.service';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-mportfolio',
  templateUrl: './mportfolio.component.html',
  styleUrls: ['./mportfolio.component.css']
})
export class MportfolioComponent implements OnInit {

  editCache: { [key: string]: any } = {};
  portfolio: Portfolio = new Portfolio();
  positions: Position[] = [
    {
      positionId: '14424',
      portfolioId: '14414',
      securityId: '04144',
      quantity: 20
    }, {
      positionId: '15421',
      portfolioId: '14414',
      securityId: '04144',
      quantity: 18
    }, {
      positionId: '14441',
      portfolioId: '14414',
      securityId: '04144',
      quantity: 20
    }, {
      positionId: '16421',
      portfolioId: '14414',
      securityId: '04144',
      quantity: 11
    }
];
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
  }

  // @ts-ignore
  constructor(public activatedRouter: ActivatedRoute, private managerService: ManagerService, private message: NzMessageService) { }

  ngOnInit() {
    this.portfolio.portfolioId = this.activatedRouter.snapshot.queryParams.portfolioId;
    this.portfolio.portfolioName = this.activatedRouter.snapshot.queryParams.portfolioName;
    this.updateEditCache();
    this.drawBarChart();
  }
  drawBarChart() {
    /*F2.track(false);
    const data = [
      { weekday: 'Mon', bugnum: 100 },
      { weekday: 'Tue', bugnum: 120 },
      { weekday: 'Wed', bugnum: 130 },
      { weekday: 'Thu', bugnum: 160 },
      { weekday: 'Fri', bugnum: 150 },
      { weekday: 'Sat', bugnum: 190 },
      { weekday: 'Sun', bugnum: 210 }
    ];
    const chart = new F2.Chart({
      id: 'f2_c1',
      pixelRatio: window.devicePixelRatio // 指定分辨率
    });

    chart.source(data);
    chart.interval().position('weekday*bugnum').color('weekday');
    chart.render();*/
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
          console.log(response.data)
          this.positions = response.data;
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
}

import { Component, OnInit } from '@angular/core';
import {Security} from '../entities/Security';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {fromEvent, Observable, Observer} from 'rxjs';
import {ApiService} from '../api.service';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {ManagerService} from '../manager.service';
import {DatePipe} from '@angular/common';
import * as echarts from 'echarts';

@Component({
  selector: 'app-asecurities',
  templateUrl: './asecurities.component.html',
  styleUrls: ['./asecurities.component.css']
})
export class AsecuritiesComponent implements OnInit {

  searchtext: string;
  showSecurities: Security[];
  isVisible = false;
  isConfirmLoading = false;
  isVisible1 = false;
  isConfirmLoading1 = false;
  isVisible2 = false;
  isConfirmLoading2 = false;
  editCache: { [key: string]: any } = {};
  validateForm: FormGroup;
  addSecurityType: string;
  addSecurityName: string;
  searchAddress: string;
  listOfSearchName: string[] = [];
  listOfSearchAddress: string[] = [];
  listOfType = [{ text: 'equity', value: 'equity' }, { text: 'future', value: 'future' },
    { text: 'index', value: 'index' }, { text: 'commodity', value: 'commodity' },
    { text: 'fx', value: 'fx' }];
  sortName: string | null = null;
  sortValue: string | null = null;
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

  uploading = false;
  fileList: UploadFile[] = [];
  selectSecurity: string;
  securityDateFeild: string;
  securityValueFeild: string;

  select: Security = new Security();
  securiries: Security[] = [
    {
      securityId: 'string',
      securityName: 'string',
      securityType: 'string',
      lastDay: new Date(),
      lastPrice: 0,
      today: new Date(),
      todayPrice: 0,
      priceId: 'string'
    }
    ];

  eChartDatas: any;
  chartOption: any;
  resize = (document.body.clientHeight - 181) + 'px';
  app = {};
  option = null;
  priceDate = new Date();

  showModal2(): void {
    this.isVisible = true;
  }
  showModal3(selectSecurity: string): void {
    this.isVisible1 = true;
    this.selectSecurity = selectSecurity;
  }
  showModal4(select: Security): void {
    this.isVisible2 = true;
    this.select = select;
    this.fetchData();
  }
  handleOk(): void {
    this.api.addSecurity(this.addSecurityName, this.addSecurityType).subscribe(
      response => {
        if (response.code === 200) {
          this.message.success('Add security success', {
            nzDuration: 2000
          });
          this.addSecurityName = '';
          this.addSecurityType = '';
          this.getSecurities();
          this.isVisible = false;
          this.isConfirmLoading = false;
        } else {
          this.message.error('Add security error:' + response.msg, {
            nzDuration: 2000
          });
        }
      }
    );
  }
  handleOk1(): void {
    this.isVisible1 = false;
    this.isConfirmLoading1 = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isVisible1 = false;
    this.isVisible2 = false;
  }
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.securiries.findIndex(item => item.securityId === id);
    this.editCache[id] = {
      data: { ...this.securiries[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    const index = this.securiries.findIndex(item => item.securityId === id);
    Object.assign(this.securiries[index], this.editCache[id].data);
    this.editCache[id].edit = false;
    if (this.editCache[id].data.priceId !== null) {
      console.log(this.editCache[id].data);
      this.api.updateSecurity(this.editCache[id].data).subscribe(
        response => {
          if (response.code === 200 ) {
            this.filter(this.listOfSearchName.length !== 0 ? this.listOfSearchName : ['equity', 'fx', 'commodity', 'index', 'future'], '');
            console.log('securityId:' + response.data.userId + ',update security success!');
          } else {
            console.error(response.msg + ': update security error!');
          }
        }
      );
    } else {
      this.api.addPrice(this.editCache[id].data.securityId, this.editCache[id].data.todayPrice).subscribe(
        response => {
          if (response.code === 200 ) {
            this.filter(this.listOfSearchName.length !== 0 ? this.listOfSearchName : ['equity', 'fx', 'commodity', 'index', 'future'], '');
            console.log('securityId:' + response.data.userId + ',update security success!');
          } else {
            console.error(response.msg + ': update security error!');
          }
        }
      );
    }

  }
  deletesecurity(securityId: string): void {
    this.api.delfunduser(securityId).subscribe(
      response => {
        console.log(response);
        if (response.code === 200 ) {
          // const data = response.data;
          this.message.success('Delete security success', {
            nzDuration: 2000
          });
        } else {
          this.message.error('Delete security error:' + response.msg, {
            nzDuration: 2000
          });
        }

      }
    );
  }

  updateEditCache(): void {
    this.securiries.forEach(item => {
      this.editCache[item.securityId] = {
        edit: false,
        data: { ...item }
      };
    });
  }
  userNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
          // you have to return `{error: true}` to mark it as an error event
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    })
  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  }

  filter(listOfSearchName: string[], searchAddress: string): void {
    this.listOfSearchName = listOfSearchName;
    this.searchAddress = searchAddress;
    // this.search();
    this.showSecurities = this.securiries.filter(item => {
      for ( const i of listOfSearchName) {
        if (item.securityType === i) {
          return true;
        }
      }
      return  false;
    });
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
  constructor(private fb: FormBuilder, private api: ApiService, private message: NzMessageService, private managerService: ManagerService, private datePipe: DatePipe) {
    this.validateForm = this.fb.group({
    securityName: ['', [Validators.required], [this.userNameAsyncValidator]],
    type: ['', [Validators.required]]
  });
  }

  ngOnInit() {
    this.getSecurities();
    fromEvent(window, 'resize')
      .subscribe(() => echarts.resize());
    this.fetchData();
  }
  getSecurities(): void {
    this.api.getSecurities().subscribe(
      response => {
        if (response.code === 200 ) {
          this.securiries = response.data;
          this.showSecurities = this.securiries;
          this.updateEditCache();
          console.log( 'get securities success！');
          console.log(this.showSecurities);
        } else {
          this.message.error('Get Securities Failure:' + response.msg, {
            nzDuration: 2000
          });
        }
      });
  }
  searchText(): void {
    const reg = '.*' + this.searchtext.toString();
    this.showSecurities = this.securiries.filter(portfolio => portfolio.securityName.match(reg));
  }
  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  }
  handleUpload(): void {
    this.handleOk1();
    console.log(this.fileList);
    this.api.uploadFile(this.selectSecurity, this.fileList[0], this.securityDateFeild, this.securityValueFeild).subscribe(
      response => {
        if (response.code === 200 ) {
          this.message.success('Upload Success', {
            nzDuration: 2000
          });
        } else {
          this.message.error('Upload Failure:' + response.msg, {
            nzDuration: 2000
          });
        }
      });
    this.fileList = [];
    this.securityValueFeild = null;
    this.securityDateFeild = null;
  }
  selectS(security: Security): void {
    this.select = security;
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

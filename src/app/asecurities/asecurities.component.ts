import { Component, OnInit } from '@angular/core';
import {Security} from '../entities/Security';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs';
import {ApiService} from '../api.service';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';
import { SecurityChartComponent} from '../security-chart/security-chart.component';

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
  showModal2(): void {
    this.isVisible = true;
  }
  showModal3(selectSecurity: string): void {
    this.isVisible1 = true;
    this.selectSecurity = selectSecurity;
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
  constructor(private fb: FormBuilder, private api: ApiService, private message: NzMessageService) {
    this.validateForm = this.fb.group({
    securityName: ['', [Validators.required], [this.userNameAsyncValidator]],
    type: ['', [Validators.required]]
  });
  }

  ngOnInit() {
    this.getSecurities();
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
  }
  selectS(security: Security): void {
    this.select = security;
  }
}

import { Component, OnInit } from '@angular/core';
import {Security} from '../entities/Security';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs';
import {ApiService} from '../api.service';
import {User} from '../entities/User';

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
  editCache: { [key: string]: any } = {};
  validateForm: FormGroup;
  addSecurityType: string;
  addSecurityName: string;
  searchAddress: string;
  listOfSearchName: string[] = [];
  listOfType = [{ text: 'equity', value: 'equity' }, { text: 'future', value: 'future' },
    { text: 'index', value: 'index' }, { text: 'commodity', value: 'commodity' },
    { text: 'fx', value: 'fx' }];
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
  handleOk(): void {
    this.api.addSecurity(this.addSecurityName, this.addSecurityType).subscribe(
      response => {
        if (response.code === 200) {
          console.log('addSecurity==' + response.data.securityId);
          this.addSecurityName = '';
          this.addSecurityType = '';
          this.getSecurities();
          this.isVisible = false;
          this.isConfirmLoading = false;
        } else {
          console.error('add security error!：' + response.msg);
        }
      }
    );
  }

  handleCancel(): void {
    this.isVisible = false;
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
            this.getSecurities();
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
            this.getSecurities();
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
          console.log('delete security success!');
        } else {
          console.log('delete security error!');
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
  constructor(private fb: FormBuilder, private api: ApiService) {
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
          console.error( 'get securities error!');
        }
      });
  }
  searchText(): void {
    const reg = '.*' + this.searchtext.toString();
    this.showSecurities = this.securiries.filter(portfolio => portfolio.securityName.match(reg));
  }
}

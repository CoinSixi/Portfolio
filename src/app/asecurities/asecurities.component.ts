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
  addSecurity: Security = new Security();

  securiries: Security[] = [
    {
      securityId: '13515',
      securityName: 'cndjcd',
      securityType: 'bonds',
      lastDay: new Date(2015, 8, 8),
      lastPrice: 12,
      today: null,
      todayPrice: 15,
    }, {
      securityId: '13515',
      securityName: 'csdjcd',
      securityType: 'bonds',
      lastDay: new Date(),
      lastPrice: 12,
      today: new Date(),
      todayPrice: 15,
    }, {
      securityId: '13515',
      securityName: 'cndsdvcd',
      securityType: 'bonds',
      lastDay: new Date(),
      lastPrice: 12,
      today: new Date(),
      todayPrice: 15,
    }, {
      securityId: '13515',
      securityName: 'cnfdvd',
      securityType: 'bonds',
      lastDay: new Date(),
      lastPrice: 12,
      today: new Date(),
      todayPrice: 15,
    }, {
      securityId: '13515',
      securityName: 'cnsscd',
      securityType: 'bonds',
      lastDay: new Date(),
      lastPrice: 12,
      today: new Date(),
      todayPrice: 15,
    }, {
      securityId: '13515',
      securityName: 'cndjdfgcd',
      securityType: 'bonds',
      lastDay: new Date(),
      lastPrice: 12,
      today: new Date(),
      todayPrice: 15,
    }, {
      securityId: '13515',
      securityName: 'cndjcd',
      securityType: 'bonds',
      lastDay: new Date(),
      lastPrice: 12,
      today: new Date(),
      todayPrice: 15,
    },
  ];
  showModal2(): void {
    this.isVisible = true;
  }
  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 3000);
    this.addSecurity.today = new Date();
    this.api.addSecurity(this.addSecurity).subscribe(
      response => {
        if (response.code === 200) {
          console.log('addSecurity==' + response.data.securityId);
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
    this.api.updateSecurity(this.editCache[id].data).subscribe(
      response => {
        if (response.code === 200 ) {
          console.log('securityId:' + response.data.userId + ',update security success!');
        } else {
          console.error(response.msg + ': update security error!');
        }
      }
    );
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
  constructor(private fb: FormBuilder, private api: ApiService) {
    this.validateForm = this.fb.group({
    securityName: ['', [Validators.required], [this.userNameAsyncValidator]],
    type: ['', [Validators.required]]
  });
  }

  ngOnInit() {
    this.api.getSecurities().subscribe(
      response => {
        if (response.code === 200 ) {
          this.securiries = response.data;
          this.showSecurities = this.securiries;
          this.updateEditCache();
          console.log( 'get securities success！');
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

import { Component, OnInit } from '@angular/core';
import {User} from '../entities/User';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs';
import {ApiService} from '../api.service';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {Portfolio} from '../entities/Portfolio';

@Component({
  selector: 'app-afund-managers',
  templateUrl: './afund-managers.component.html',
  styleUrls: ['./afund-managers.component.css']
})
export class AfundManagersComponent implements OnInit {
  searchtext: string;
  isVisible = false;
  isConfirmLoading = false;
  listUsers: User[];
  editCache: { [key: string]: any } = {};
  validateForm: FormGroup;
  addUser: User = new User();
  showUser: User[];
  showModal2(): void {
    this.isVisible = true;

  }
  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 3000);
    this.addUser.role = 'manager';
    this.addUser.userId = null;
    // console.log(this.addUser);
    this.api.addfunduser(this.addUser).subscribe(
      response => {
        if (response.code === 200) {
          console.log('addfunduser==' + response.data.userId);
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
    const index = this.listUsers.findIndex(item => item.userId === id);
    this.editCache[id] = {
      data: { ...this.listUsers[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    const index = this.listUsers.findIndex(item => item.userId === id);
    Object.assign(this.listUsers[index], this.editCache[id].data);
    this.editCache[id].edit = false;
    // console.log('password====' + this.editCache[id].data.password);
    this.api.updatefunduser(this.editCache[id].data).subscribe(
      response => {
        if (response.code === 200 ) {
          console.log('userid:' + response.data.userId + ',update funduser success!');
        } else {
          console.log('update funduser error: ' + response.msg);
        }
      }
    );
  }
  deletefundsuser(userId: string): void {
    this.api.delfunduser(userId).subscribe(
      response => {
        console.log(response);
        if (response.code === 200 ) {
          const data = response.data;
          console.log('delete funduser success!');
        } else {
          console.error('delete funduser error!');
        }

      }
    );
  }
  updateEditCache(): void {
    // console.log(this.listUsers);
    this.listUsers.forEach(item => {
      this.editCache[item.userId] = {
        edit: false,
        data: { ...item }
      };
    });
  }



  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
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
      username: ['', [Validators.required], [this.userNameAsyncValidator]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirm: ['', [this.confirmValidator]]
    });
  }

  ngOnInit() {
    this.api.getfundusers().subscribe(
      response => {
        if (response.code === 200 ) {
          this.listUsers = response.data;
          this.showUser = this.listUsers;
          // console.log('***');
          // console.log(this.showUser);
          this.updateEditCache();
          console.log( 'get fundusers success!');
        } else {
          console.error( 'get fundusers error!');
        }
      }
    );
  }

  searchText(): void {
    const reg = '.*' + this.searchtext.toString();
    console.log(this.listUsers);
    this.showUser = this.listUsers.filter(user => user.username.match(reg));
  }
}

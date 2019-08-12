import { Component, OnInit } from '@angular/core';
import {User} from '../entities/User';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs';

@Component({
  selector: 'app-afund-managers',
  templateUrl: './afund-managers.component.html',
  styleUrls: ['./afund-managers.component.css']
})
export class AfundManagersComponent implements OnInit {
  isVisible = false;
  isConfirmLoading = false;
  listUsers: User[];
  editCache: { [key: string]: any } = {};
  validateForm: FormGroup;
  addUser: User = new User();
  listOfData = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
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
    this.addUser.role = 'manager';
    this.addUser.userId = null;
    console.log(this.addUser);
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
  }

  updateEditCache(): void {
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
  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      username: ['', [Validators.required], [this.userNameAsyncValidator]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirm: ['', [this.confirmValidator]]
    });
  }

  ngOnInit() {
    this.listUsers = [{
      userId: '22222',
      username: 'sixi',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22223',
      username: 'sixi3',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22222',
      username: 'sixi',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22223',
      username: 'sixi3',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22222',
      username: 'sixi',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22223',
      username: 'sixi3',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22222',
      username: 'sixi',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22223',
      username: 'sixi3',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22222',
      username: 'sixi',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22223',
      username: 'sixi3',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22222',
      username: 'sixi',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22223',
      username: 'sixi3',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22222',
      username: 'sixi',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22223',
      username: 'sixi3',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22222',
      username: 'sixi',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22223',
      username: 'sixi3',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22222',
      username: 'sixi',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22223',
      username: 'sixi3',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22222',
      username: 'sixi',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22223',
      username: 'sixi3',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22222',
      username: 'sixi',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22223',
      username: 'sixi3',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22222',
      username: 'sixi',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22223',
      username: 'sixi3',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22222',
      username: 'sixi',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }, {
      userId: '22223',
      username: 'sixi3',
      password: '123',
      role: 'manager',
      phone: '18742018902'
    }];
    this.updateEditCache();
  }

}

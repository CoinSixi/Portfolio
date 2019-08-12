import { Component, OnInit } from '@angular/core';
import {Portfolio} from '../entities/Portfolio';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs';
import {ManagerService} from '../manager.service';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-mportfolios',
  templateUrl: './mportfolios.component.html',
  styleUrls: ['./mportfolios.component.css']
})
export class MportfoliosComponent implements OnInit {
  searchtext: string;
  portfolioName: string;
  portfolios: Portfolio[] = [];

  showPortfolios: Portfolio[];
  isVisible = false;
  isConfirmLoading = false;
  validateForm: FormGroup;

  showModal2(): void {
    this.isVisible = true;

  }
  handleOk(): void {
    this.isVisible = false;
    this.isConfirmLoading = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  searchText(): void {
    const reg = '.*' + this.searchtext.toString();
    this.showPortfolios = this.portfolios.filter(portfolio => portfolio.portfolioId.match(reg));
  }

  getPortfolios(): void {
    this.managerService.getPortfoliosList().subscribe(
      response => {
        if (response.code === 200 ) {
          console.log(response.data)
          this.portfolios = response.data;
          this.showPortfolios = response.data;
        } else {
          this.message.error('Get Failure:' + response.msg, {
            nzDuration: 10000
          });
        }
      }
    );
  }

  addPortfolio(): void {

    this.managerService.addPortFolio(this.portfolioName).subscribe(
      response => {
        console.log(response);
        if (response.code === 200 ) {
          const port: Portfolio = response.data;
          this.getPortfolios();
          this.handleOk();
          this.message.success('Create Success!', {
            nzDuration: 10000
          });
        } else {
          this.message.error('Create Failure:' + response.msg, {
            nzDuration: 10000
          });
        }
        this.portfolioName = '';
      }
    );
  }

  deletePortfolio(portfolioId: string): void {
    this.managerService.deletePortFolio(portfolioId).subscribe(
      response => {
        console.log(response);
        if (response.code === 200 ) {
          const port: Portfolio = response.data;
          this.portfolios.filter(portfolio => portfolio.portfolioId !== portfolioId);
          this.showPortfolios = this.portfolios;
          this.message.success('Delete Success!', {
            nzDuration: 10000
          });
        } else {
          this.message.error('Delete Failure:' + response.msg, {
            nzDuration: 10000
          });
        }
        this.portfolioName = '';
      }
    );
  }
  constructor(private fb: FormBuilder, private managerService: ManagerService, private message: NzMessageService) {
    this.validateForm = this.fb.group({
      portfolioName: ['', [Validators.required]]
    });
    // this.showPortfolios = this.portfolios;
    this.getPortfolios();
  }

  ngOnInit() {
  }

}

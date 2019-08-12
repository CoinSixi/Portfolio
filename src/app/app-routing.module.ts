import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent} from './login/login.component';
import { AdminiComponent} from './admini/admini.component';
import { ManagerComponent} from './manager/manager.component';
import {AfundManagersComponent} from './afund-managers/afund-managers.component';
import {AsecuritiesComponent} from './asecurities/asecurities.component';
import {AportfoliosComponent} from './aportfolios/aportfolios.component';
import {MportfoliosComponent} from './mportfolios/mportfolios.component';
import {MportfolioComponent} from './mportfolio/mportfolio.component';
import {AportfolioComponent} from './aportfolio/aportfolio.component';
import {MsecuritiesComponent} from './msecurities/msecurities.component';

const managerChildRoutes: Routes = [
  {path: '', redirectTo: '/portfolios', pathMatch: 'full'},
  {path: 'portfolios', component: MportfoliosComponent},
  {path: 'securities', component: MsecuritiesComponent},
  {path: 'portfolios/:id', component: MportfolioComponent}
];
const adminChildRoutes: Routes = [
  {path: '', redirectTo: '/fund-manager', pathMatch: 'full'},
  {path: 'fund-manager', component: AfundManagersComponent},
  {path: 'securities', component: AsecuritiesComponent},
  {path: 'portfolios', component: AportfoliosComponent},
  {path: 'portfolios/:id', component: AportfolioComponent}
];
const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'administrator', component: AdminiComponent, children: adminChildRoutes},
  {path: 'manager', component: ManagerComponent, children: managerChildRoutes}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

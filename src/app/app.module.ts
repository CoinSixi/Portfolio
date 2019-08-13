import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminiComponent } from './admini/admini.component';
import { ManagerComponent } from './manager/manager.component';
import { FormsModule} from '@angular/forms';
import { DataTablesModule} from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule, NZ_I18N, en_US, NZ_ICONS } from 'ng-zorro-antd';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import {HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { AfundManagersComponent } from './afund-managers/afund-managers.component';
import { AsecuritiesComponent } from './asecurities/asecurities.component';
import { AportfoliosComponent } from './aportfolios/aportfolios.component';
import { MportfoliosComponent } from './mportfolios/mportfolios.component';
import { MportfolioComponent } from './mportfolio/mportfolio.component';
import { AportfolioComponent } from './aportfolio/aportfolio.component';
import {MsecuritiesComponent} from './msecurities/msecurities.component';
import {G2ChartModule} from 'g2-angular';
import F2 from '@antv/f2/build/f2';
registerLocaleData(en);
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminiComponent,
    ManagerComponent,
    AfundManagersComponent,
    AsecuritiesComponent,
    AportfoliosComponent,
    MportfoliosComponent,
    MportfolioComponent,
    AportfolioComponent,
    MsecuritiesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    HttpClientModule,
    BrowserAnimationsModule,
    HttpClientJsonpModule,
    ScrollingModule,
    DragDropModule,
    G2ChartModule.forRoot()
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, { provide: NZ_ICONS, useValue: icons }],
  bootstrap: [AppComponent]
})
export class AppModule { }

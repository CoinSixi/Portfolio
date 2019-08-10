import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminiComponent } from './admini/admini.component';
import { ManagerComponent } from './manager/manager.component';
import { HeadComponent } from './head/head.component';
import { AnavigationComponent } from './anavigation/anavigation.component';
import { MnavigationComponent } from './mnavigation/mnavigation.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminiComponent,
    ManagerComponent,
    HeadComponent,
    AnavigationComponent,
    MnavigationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

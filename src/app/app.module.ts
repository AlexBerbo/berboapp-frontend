import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './module/core.module';
import { AuthModule } from './component/auth/auth.module';
import { CustomerModule } from './component/customer/customer.module';
import { InvoiceModule } from './component/invoice/invoice.module';
import { HomeModule } from './component/home-page/home.module';
import { ReportModule } from './component/report/report.module';
import { NotificationModule } from './module/notification.module';
import { ServiceModule } from './component/service/service.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AuthModule,
    CustomerModule,
    HomeModule,
    InvoiceModule,
    ReportModule,
    ServiceModule,
    AppRoutingModule,
    NotificationModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

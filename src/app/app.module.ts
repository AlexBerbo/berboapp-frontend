import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { VerifyComponent } from './component/verify/verify.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CustomerComponent } from './component/customer/customer.component';
import { CustomersComponent } from './component/customers/customers.component';
import { ProfileComponent } from './component/profile/profile.component';
import { HomeComponent } from './component/home/home.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { StatsComponent } from './component/stats/stats.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { InvoicesComponent } from './component/invoices/invoices.component';
import { NewInvoiceComponent } from './component/new-invoice/new-invoice.component';
import { NewCustomerComponent } from './component/new-customer/new-customer.component';
import { InvoiceComponent } from './component/invoice/invoice.component';
import { ReportComponent } from './component/report/report.component';
import { ExtractValuePipe } from './pipe/extract-value.pipe';
import { CacheInterceptor } from './interceptor/cache.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    VerifyComponent,
    ResetPasswordComponent,
    CustomersComponent,
    CustomerComponent,
    ProfileComponent,
    HomeComponent,
    NavbarComponent,
    StatsComponent,
    InvoicesComponent,
    NewInvoiceComponent,
    NewCustomerComponent,
    InvoiceComponent,
    ReportComponent,
    ExtractValuePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, 
              { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from "@angular/core";
import { UserService } from "../service/user.service";
import { CacheService } from "../service/cache.service";
import { CustomerService } from "../service/customer.service";
import { InvoiceService } from "../service/invoice.service";
import { ReportService } from "../service/report.service";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthInterceptor } from "../interceptor/auth.interceptor";
import { CacheInterceptor } from "../interceptor/cache.interceptor";
import { NotificationService } from "../service/notification.service";
import { ServiceCustomerService } from "../service/service-customer.service";

@NgModule({
    imports: [HttpClientModule],
    providers: [
        UserService, CacheService, CustomerService, InvoiceService, ReportService, NotificationService, ServiceCustomerService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
    ]
})
export class CoreModule { }
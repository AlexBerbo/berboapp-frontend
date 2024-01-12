import { NgModule } from "@angular/core";
import { CustomerDetailComponent } from "./customer-detail/customer-detail.component";
import { NewCustomerComponent } from "./new-customer/new-customer.component";
import { SharedModule } from "src/app/module/shared.module";
import { CustomerRoutingModule } from "./customer-routing.module";
import { CustomersComponent } from "./customers/customers.component";
import { NavBarModule } from "../navbar/navbar.module";

@NgModule({
    declarations: [ CustomersComponent, NewCustomerComponent, CustomerDetailComponent],
    imports: [SharedModule, CustomerRoutingModule, NavBarModule]
})
export class CustomerModule {}
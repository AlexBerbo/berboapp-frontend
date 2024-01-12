import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from 'src/app/guard/authentication.guard';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomersComponent } from './customers/customers.component';
import { NewCustomerComponent } from './new-customer/new-customer.component';

const customerRoutes: Routes = [
    { path: 'customers', component: CustomersComponent, canActivate: [AuthenticationGuard] },
    { path: 'customer/new', component: NewCustomerComponent, canActivate: [AuthenticationGuard] },
    { path: 'customer/:id', component: CustomerDetailComponent, canActivate: [AuthenticationGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(customerRoutes)],
    exports: [RouterModule]
})
export class CustomerRoutingModule { }
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from 'src/app/guard/authentication.guard';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { NewInvoiceComponent } from './new-invoice/new-invoice.component';

const invoiceRoutes: Routes = [
    { path: 'invoices', component: InvoicesComponent, canActivate: [AuthenticationGuard] },
    { path: 'invoice/new', component: NewInvoiceComponent, canActivate: [AuthenticationGuard] },
    { path: 'invoices/:id/:invoiceNumber', component: InvoiceDetailComponent, canActivate: [AuthenticationGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(invoiceRoutes)],
    exports: [RouterModule]
})
export class InvoiceRoutingModule { }
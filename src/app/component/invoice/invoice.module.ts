import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/module/shared.module";
import { InvoicesComponent } from "./invoices/invoices.component";
import { InvoiceDetailComponent } from "./invoice-detail/invoice-detail.component";
import { NewInvoiceComponent } from "./new-invoice/new-invoice.component";
import { InvoiceRoutingModule } from "./invoice-routing.module";
import { NavBarModule } from "../navbar/navbar.module";

@NgModule({
    declarations: [InvoicesComponent, InvoiceDetailComponent, NewInvoiceComponent],
    imports: [SharedModule, InvoiceRoutingModule, NavBarModule]
})
export class InvoiceModule { }
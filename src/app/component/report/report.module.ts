import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/module/shared.module";
import { NavBarModule } from "../navbar/navbar.module";
import { ReportComponent } from "./report.component";
import { ReportRoutingModule } from "./report-routing.module";

@NgModule({
    declarations: [ ReportComponent ],
    imports: [SharedModule, ReportRoutingModule, NavBarModule]
})
export class ReportModule {}
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/module/shared.module";
import { NavBarModule } from "../navbar/navbar.module";
import { ServicesComponent } from "./services/services.component";
import { NewServiceComponent } from "./new-service/new-service.component";
import { ServiceDetailComponent } from "./service-detail/service-detail.component";
import { ServiceRoutingModule } from "./service.routing.module";

@NgModule({
    declarations: [ServicesComponent, NewServiceComponent, ServiceDetailComponent],
    imports: [SharedModule, ServiceRoutingModule, NavBarModule]
})
export class ServiceModule { }
import { NgModule } from "@angular/core";
import { NavbarComponent } from "./navbar.component";
import { SharedModule } from "src/app/module/shared.module";

@NgModule({
    declarations: [NavbarComponent],
    imports: [SharedModule],
    exports: [NavbarComponent]
})
export class NavBarModule {}
import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { VerifyComponent } from "./verify/verify.component";
import { SharedModule } from "src/app/module/shared.module";
import { AuthRoutingModule } from "./auth-routing.module";

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        ResetPasswordComponent,
        VerifyComponent
    ],
    imports: [SharedModule, AuthRoutingModule]
})
export class AuthModule { }
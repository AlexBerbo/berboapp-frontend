import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from 'src/app/guard/authentication.guard';
import { ReportComponent } from './report.component';

const reportRoutes: Routes = [{ path: 'report/:id', component: ReportComponent, canActivate: [AuthenticationGuard] }];

@NgModule({
    imports: [RouterModule.forChild(reportRoutes)],
    exports: [RouterModule]
})
export class ReportRoutingModule { }
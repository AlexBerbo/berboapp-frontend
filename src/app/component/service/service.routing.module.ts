import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from 'src/app/guard/authentication.guard';
import { ServicesComponent } from './services/services.component';
import { NewServiceComponent } from './new-service/new-service.component';
import { ServiceDetailComponent } from './service-detail/service-detail.component';

const serviceRoutes: Routes = [
    { path: 'services', component: ServicesComponent, canActivate: [AuthenticationGuard] },
    { path: 'service/new', component: NewServiceComponent, canActivate: [AuthenticationGuard] },
    { path: 'service/:id/:serviceNumber', component: ServiceDetailComponent, canActivate: [AuthenticationGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(serviceRoutes)],
    exports: [RouterModule]
})
export class ServiceRoutingModule { }
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, BehaviorSubject, map, startWith, catchError, of } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { Role } from 'src/app/enum/role.enum';
import { InvoiceCustomerUserState } from 'src/app/interface/appstate';
import { CustomHttpResponse } from 'src/app/interface/custom-http-resposne';
import { State } from 'src/app/interface/state';
import { NotificationService } from 'src/app/service/notification.service';
import { ServiceCustomerService } from 'src/app/service/service-customer.service';

@Component({
  selector: 'app-new-service',
  templateUrl: './new-service.component.html',
  styleUrls: ['./new-service.component.css']
})
export class NewServiceComponent implements OnInit {
  serviceState$: Observable<State<CustomHttpResponse<InvoiceCustomerUserState>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<InvoiceCustomerUserState>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  readonly Role = Role;

  constructor(private serviceCustomerService: ServiceCustomerService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.serviceState$ = this.serviceCustomerService.newService$()
      .pipe(
        map(response => {
          this.notificationService.onDefault(response.message);
          console.log(response);
          this.dataSubject.next(response);
          return { dataState: DataState.LOADED, appData: response }
        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          this.notificationService.onDefault(error);
          return of({ dataState: DataState.ERROR, error })
        })
      )
  }

  addService(serviceForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.dataSubject.next({ ...this.dataSubject.value, message: '' })
    this.serviceState$ = this.serviceCustomerService.addService$(serviceForm.value)
      .pipe(
        map(response => {
          this.notificationService.onDefault(response.message);
          console.log(response);
          serviceForm.reset();
          this.isLoadingSubject.next(false);
          this.dataSubject.next(response);
          return { dataState: DataState.LOADED, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.notificationService.onDefault(error);
          this.isLoadingSubject.next(false);
          return of({ dataState: DataState.ERROR, error })
        })
      )
  }
}

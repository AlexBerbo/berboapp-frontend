import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, map, startWith, catchError, of } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { PageServiceUserState } from 'src/app/interface/appstate';
import { CustomHttpResponse } from 'src/app/interface/custom-http-resposne';
import { ServiceCustomer } from 'src/app/interface/service-customer';
import { State } from 'src/app/interface/state';
import { NotificationService } from 'src/app/service/notification.service';
import { ServiceCustomerService } from 'src/app/service/service-customer.service';

@Component({
  selector: 'app-service',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  serviceState$: Observable<State<CustomHttpResponse<PageServiceUserState<ServiceCustomer>>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<PageServiceUserState<ServiceCustomer>>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private fileStatusSubject = new BehaviorSubject<{ status: string, type: string, progress: number }>(undefined);
  fileStatus$ = this.fileStatusSubject.asObservable();
  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();
  readonly DataState = DataState;

  constructor(private router: Router, private serviceCustomerService: ServiceCustomerService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.serviceState$ = this.serviceCustomerService.getServices$()
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

  goToPage(pageNumber?: number): void {
    this.serviceState$ = this.serviceCustomerService.getServices$(pageNumber).pipe(
      map(response => {
        console.log(response);
        this.dataSubject.next(response);
        this.currentPageSubject.next(pageNumber);
        return { dataState: DataState.LOADED, appData: response }
      }),
      startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
      catchError((error: string) => {
        return of({ dataState: DataState.LOADED, error })
      })
    )
  }

  goToNextPage(direction?: string): void {
    this.goToPage(direction === 'forwards' ? this.currentPageSubject.value + 1 : this.currentPageSubject.value - 1);
  }

  selectedService(service: ServiceCustomer): void {
    this.router.navigate([`service/${service.id}`]);
  }
}

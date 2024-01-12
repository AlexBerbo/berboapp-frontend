import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, BehaviorSubject, map, startWith, catchError, of } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { Role } from 'src/app/enum/role.enum';
import { PageCustomerUserStatsState } from 'src/app/interface/appstate';
import { CustomHttpResponse } from 'src/app/interface/custom-http-resposne';
import { Customer } from 'src/app/interface/customer';
import { State } from 'src/app/interface/state';
import { CustomerService } from 'src/app/service/customer.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewCustomerComponent implements OnInit {
  newCustomerState$: Observable<State<CustomHttpResponse<PageCustomerUserStatsState<Customer>>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<PageCustomerUserStatsState<Customer>>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  readonly Role = Role;

  constructor(private customerService: CustomerService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.newCustomerState$ = this.customerService.customers$().pipe(map(response => {
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

  createCustomer(customerForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.newCustomerState$ = this.customerService.createCustomer$(customerForm.value)
    .pipe(
      map(response => {
      this.notificationService.onDefault(response.message);
      console.log(response);
      customerForm.reset({ type: 'INDIVIDUAL', status: 'ACTIVE' });
      this.isLoadingSubject.next(false);
      return { dataState: DataState.LOADED, appData: this.dataSubject.value }
    }),
      startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
      catchError((error: string) => {
        this.isLoadingSubject.next(false);
        this.notificationService.onDefault(error);
        return of({ dataState: DataState.LOADED, error })
      })
    )
  }
}

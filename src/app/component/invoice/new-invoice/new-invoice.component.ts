import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, BehaviorSubject, map, startWith, catchError, of } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { Role } from 'src/app/enum/role.enum';
import { InvoiceCustomerUserState } from 'src/app/interface/appstate';
import { CustomHttpResponse } from 'src/app/interface/custom-http-resposne';
import { State } from 'src/app/interface/state';
import { InvoiceService } from 'src/app/service/invoice.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewInvoiceComponent implements OnInit {
  newInvoiceState$: Observable<State<CustomHttpResponse<InvoiceCustomerUserState>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<InvoiceCustomerUserState>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  readonly Role = Role;
  total: number = 0;

  constructor(private invoiceService: InvoiceService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.newInvoiceState$ = this.invoiceService.newInvoice$()
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

  addToCustomer(invoiceForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.dataSubject.next({ ...this.dataSubject.value, message: '' })
    this.newInvoiceState$ = this.invoiceService.addToCustomer$(invoiceForm.value.customerId, invoiceForm.value.serviceId, invoiceForm.value)
      .pipe(
        map(response => {
          this.notificationService.onDefault(response.message);
          console.log(response);
          invoiceForm.reset({ status: 'PENDING' });
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

  getTotal(price: number, fee: number): number {
    return this.total = price + fee;
  }
}

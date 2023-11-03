import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, map, startWith, catchError, of } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomHttpResponse, Page } from 'src/app/interface/custom-http-resposne';
import { Invoice } from 'src/app/interface/invoice';
import { State } from 'src/app/interface/state';
import { User } from 'src/app/interface/user';
import { InvoiceService } from 'src/app/service/invoice.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {
  invoiceState$: Observable<State<CustomHttpResponse<Page<Invoice>  & User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Page<Invoice> & User>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();
  readonly DataState = DataState;

  constructor(private router: Router, private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.invoiceState$ = this.invoiceService.getInvoices$()
    .pipe(
      map(response => {
        console.log(response);
        this.dataSubject.next(response);
        return { dataState: DataState.LOADED, appData: response }
    }),
      startWith({ dataState: DataState.LOADING }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR, error })
      })
    )
  }

  goToPage(pageNumber?: number): void {
    this.invoiceState$ = this.invoiceService.getInvoices$(pageNumber).pipe(
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

  selectedInvoice(invoice: Invoice): void {
    this.router.navigate([`invoice/${invoice.id}`]);
  }
}

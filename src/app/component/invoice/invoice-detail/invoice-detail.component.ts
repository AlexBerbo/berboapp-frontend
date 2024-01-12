import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, BehaviorSubject, switchMap, map, startWith, catchError, of } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomHttpResponse } from 'src/app/interface/custom-http-resposne';
import { State } from 'src/app/interface/state';
import { InvoiceService } from 'src/app/service/invoice.service';
import jsPDF, { jsPDF as pdf } from 'jspdf';
import { NotificationService } from 'src/app/service/notification.service';
import { InvoiceState } from 'src/app/interface/appstate';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceDetailComponent implements OnInit {
  invoiceState$: Observable<State<CustomHttpResponse<InvoiceState>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<InvoiceState>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  private readonly INVOICE_ID: string = 'id';

  constructor(private activatedRoute: ActivatedRoute, private invoiceService: InvoiceService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.invoiceState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.invoiceService.getInvoice$(+params.get(this.INVOICE_ID)).pipe(map(response => {
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
      })
    )
  }

  exportAsPDF(): void {
    const filename = `invoice-${this.dataSubject.value.data['invoice'].invoiceNumber}.pdf`;
    const doc = new pdf();
    doc.html(document.getElementById('invoice'), 
    { margin: 5, 
      windowWidth: 1000, 
      width: 200, 
      callback: (invoice) => invoice.save(filename) 
    })
  }
}

import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, map, startWith, catchError, of } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { Role } from 'src/app/enum/role.enum';
import { CustomHttpResponse } from 'src/app/interface/custom-http-resposne';
import { Customer } from 'src/app/interface/customer';
import { State } from 'src/app/interface/state';
import { CustomerService } from 'src/app/service/customer.service';
import { saveAs } from 'file-saver';
import { NotificationService } from 'src/app/service/notification.service';
import { PageCustomerUserStatsState } from 'src/app/interface/appstate';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  homeState$: Observable<State<CustomHttpResponse<PageCustomerUserStatsState<Customer>>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<PageCustomerUserStatsState<Customer>>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private showLogsSubject = new BehaviorSubject<boolean>(false);
  showLogs$ = this.showLogsSubject.asObservable();
  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();
  private fileStatusSubject = new BehaviorSubject<{ status: string, type: string, progress: number }>(undefined);
  fileStatus$ = this.fileStatusSubject.asObservable();
  readonly DataState = DataState;
  readonly Role = Role;

  constructor(private router: Router, private customerService: CustomerService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.homeState$ = this.customerService.customers$().pipe(map(response => {
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
    this.homeState$ = this.customerService.customers$(pageNumber).pipe(
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

  selectedCustomer(customer: Customer): void {
    this.router.navigate([`/customer/${customer.id}`]);
  }

  report(): void {
    this.homeState$ = this.customerService.downloadReport$().pipe(
      map(response => {
        this.notificationService.onDefault('Report successfully downloaded!');
        console.log(response);
        this.reportProgress(response);
        return { dataState: DataState.LOADED, appData: this.dataSubject.value }
      }),
      startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
      catchError((error: string) => {
        this.notificationService.onDefault(error);
        return of({ dataState: DataState.LOADED, error, appData: this.dataSubject.value })
      })
    )
  }

  private reportProgress(httpEvent: HttpEvent<string[] | Blob>): void {
    switch(httpEvent.type) {
      case HttpEventType.DownloadProgress || HttpEventType.UploadProgress:
        this.fileStatusSubject.next({ status: 'progress', type: 'Downloading...', progress: Math.round(100 * (httpEvent.loaded / httpEvent.total))});
        break;
      case HttpEventType.ResponseHeader:
        console.log('Reponse header: ', httpEvent);
        break;
      case HttpEventType.Response:
        saveAs(new File([<Blob>httpEvent.body], httpEvent.headers.get('File-name'), { type: `${httpEvent.headers.get('Content-Type')};charset=utf-8` }))
        this.fileStatusSubject.next(undefined);
        break;
      default:
        console.log(httpEvent);
        break;
    }
  } 
}

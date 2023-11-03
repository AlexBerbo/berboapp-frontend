import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, map, startWith, catchError, of } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { Role } from 'src/app/enum/role.enum';
import { CustomHttpResponse, Page } from 'src/app/interface/custom-http-resposne';
import { Customer } from 'src/app/interface/customer';
import { State } from 'src/app/interface/state';
import { Stats } from 'src/app/interface/stats';
import { User } from 'src/app/interface/user';
import { CustomerService } from 'src/app/service/customer.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customerState$: Observable<State<CustomHttpResponse<Page<Customer>  & User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Page<Customer>  & User>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private showLogsSubject = new BehaviorSubject<boolean>(false);
  showLogs$ = this.showLogsSubject.asObservable();
  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();
  readonly DataState = DataState;
  readonly Role = Role;

  constructor(private router: Router, private customerService: CustomerService) { }

  ngOnInit(): void {
    this.customerState$ = this.customerService.searchCustomer$().pipe(map(response => {
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

  searchCustomer(searchForm: NgForm): void {
    this.customerState$ = this.customerService.searchCustomer$(searchForm.value.name).pipe(map(response => {
      console.log(response);
      this.currentPageSubject.next(0);
      this.dataSubject.next(response);
      return { dataState: DataState.LOADED, appData: response }
    }),
      startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR, error })
      })
    )
  }

  goToPage(name?: string, pageNumber?: number): void {
    this.customerState$ = this.customerService.searchCustomer$(name, pageNumber).pipe(
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

  goToNextPage(name?: string, direction?: string): void {
    this.goToPage(name, direction === 'forwards' ? this.currentPageSubject.value + 1 : this.currentPageSubject.value - 1);
  }

  selectedCustomer(customer: Customer): void {
    this.router.navigate([`customer/${customer.id}`]);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CustomHttpResponse, CustomerState } from '../interface/custom-http-resposne';
import { Customer } from '../interface/customer';
import { User } from '../interface/user';
import { PageCustomerUserState, PageCustomerUserStatsState } from '../interface/appstate';

@Injectable()
export class CustomerService {
  constructor(private http: HttpClient) { }

  private server: string = 'http://localhost:8080';

  customers$ = (page: number = 0) => <Observable<CustomHttpResponse<PageCustomerUserStatsState<Customer>>>>
    this.http.get<CustomHttpResponse<PageCustomerUserStatsState<Customer>>>(`${this.server}/customer/list?page=${page}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  searchCustomer$ = (name: string = '', page: number = 0) => <Observable<CustomHttpResponse<PageCustomerUserState<Customer>>>>
    this.http.get<CustomHttpResponse<PageCustomerUserState<Customer>>>(`${this.server}/customer/search?name=${name}&page=${page}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  createCustomer$ = (customer: Customer) => <Observable<CustomHttpResponse<CustomerState>>>
    this.http.post<CustomHttpResponse<Customer & User>>(`${this.server}/customer/create`, customer)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  updateCustomer$ = (customer: Customer) => <Observable<CustomHttpResponse<CustomerState>>>
    this.http.put<CustomHttpResponse<CustomerState>>(`${this.server}/customer/update`, customer)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  getCustomer$ = (customerId: number) => <Observable<CustomHttpResponse<CustomerState>>>
    this.http.get<CustomHttpResponse<CustomerState>>(`${this.server}/customer/get/${customerId}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  downloadReport$ = () => <Observable<HttpEvent<Blob>>>
    this.http.get(`${this.server}/customer/download/report`,
      { reportProgress: true, observe: 'events', responseType: 'blob' })
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );


  handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A client error occurred - ${error.error.message}`;
    } else {
      if (error.error.reason) {
        errorMessage = error.error.reason;
        console.log(errorMessage);
      } else {
        errorMessage = `An error occurred - Error status ${error.status}`;
      }
    }
    return throwError(() => errorMessage);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CustomHttpResponse } from '../interface/custom-http-resposne';
import { InvoiceCustomerUserState, PageServiceUserState } from '../interface/appstate';
import { ServiceCustomer } from '../interface/service-customer';


@Injectable()
export class ServiceCustomerService {
    constructor(private http: HttpClient) { }

    private server: string = 'http://localhost:8080';

    getServices$ = (page: number = 0) => <Observable<CustomHttpResponse<PageServiceUserState<ServiceCustomer>>>>
        this.http.get<CustomHttpResponse<PageServiceUserState<ServiceCustomer>>>(`${this.server}/service/list?=${page}`)
            .pipe(
                tap(console.log),
                catchError(this.handleError)
            );

    newService$ = () => <Observable<CustomHttpResponse<InvoiceCustomerUserState>>>
        this.http.get<CustomHttpResponse<InvoiceCustomerUserState>>(`${this.server}/service/new`)
            .pipe(
                tap(console.log),
                catchError(this.handleError)
            );

    addService$ = (service: ServiceCustomer) => <Observable<CustomHttpResponse<InvoiceCustomerUserState>>>
        this.http.post<CustomHttpResponse<InvoiceCustomerUserState>>(`${this.server}/service/create`, service)
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

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CustomHttpResponse, Page } from '../interface/custom-http-resposne';
import { Customer } from '../interface/customer';
import { User } from '../interface/user';
import { Invoice } from '../interface/invoice';


@Injectable({
    providedIn: 'root'
})
export class InvoiceService {
    constructor(private http: HttpClient) { }

    private server: string = 'http://localhost:8080';

    newInvoice$ = () => <Observable<CustomHttpResponse<Customer[] & User>>>
        this.http.get<CustomHttpResponse<Customer[] & User>>(`${this.server}/invoice/new`)
            .pipe(
                tap(console.log),
                catchError(this.handleError)
            );

    addToCustomer$ = (customerId: number, invoice: Invoice) => <Observable<CustomHttpResponse<Customer[] & User>>>
        this.http.post<CustomHttpResponse<Customer[] & User>>(`${this.server}/invoice/add-to-customer/${customerId}`, invoice)
            .pipe(
                tap(console.log),
                catchError(this.handleError)
            );

    getInvoices$ = (page: number = 0) => <Observable<CustomHttpResponse<Page<Invoice> & User>>>
        this.http.get<CustomHttpResponse<Page<Invoice> & User>>(`${this.server}/invoice/list?page=${page}`)
            .pipe(
                tap(console.log),
                catchError(this.handleError)
            );

    getInvoice$ = (invoiceId: number) => <Observable<CustomHttpResponse<Customer & Invoice & User>>>
        this.http.get<CustomHttpResponse<Customer & Invoice & User>>(`${this.server}/invoice/get/${invoiceId}`)
            .pipe(
                tap(console.log),
                catchError(this.handleError)
            );

    handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage: string;
        if (error.error instanceof ErrorEvent) {
            errorMessage = `An error occurred - ${error.error.message}`;
        } else {
            if (error.error.reason) {
                errorMessage = error.error.reason;
                console.log(errorMessage);
            } else {
                errorMessage = `An error occurred, error - ${error.status}`;
            }
        }
        return throwError(() => errorMessage);
    }
}

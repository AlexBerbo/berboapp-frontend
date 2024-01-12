import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CustomHttpResponse } from '../interface/custom-http-resposne';
import { Invoice } from '../interface/invoice';
import { InvoiceCustomerUserState, InvoiceState, PageInvoiceUserState } from '../interface/appstate';


@Injectable()
export class InvoiceService {
    constructor(private http: HttpClient) { }

    private server: string = 'http://localhost:8080';

    newInvoice$ = () => <Observable<CustomHttpResponse<InvoiceCustomerUserState>>>
        this.http.get<CustomHttpResponse<InvoiceCustomerUserState>>(`${this.server}/invoice/new`)
            .pipe(
                tap(console.log),
                catchError(this.handleError)
            );

    addToCustomer$ = (customerId: number, serviceId: number, invoice: Invoice) => <Observable<CustomHttpResponse<InvoiceCustomerUserState>>>
        this.http.post<CustomHttpResponse<InvoiceCustomerUserState>>(`${this.server}/invoice/add-to-customer/${customerId}/${serviceId}`, invoice)
            .pipe(
                tap(console.log),
                catchError(this.handleError)
            );

    getInvoices$ = (page: number = 0) => <Observable<CustomHttpResponse<PageInvoiceUserState<Invoice>>>>
        this.http.get<CustomHttpResponse<PageInvoiceUserState<Invoice>>>(`${this.server}/invoice/list?page=${page}`)
            .pipe(
                tap(console.log),
                catchError(this.handleError)
            );

    getInvoice$ = (invoiceId: number) => <Observable<CustomHttpResponse<InvoiceState>>>
        this.http.get<CustomHttpResponse<InvoiceState>>(`${this.server}/invoice/get/${invoiceId}`)
            .pipe(
                tap(console.log),
                catchError(this.handleError)
            );

    downloadReport$ = () => <Observable<HttpEvent<Blob>>>
        this.http.get(`${this.server}/invoice/download/report`,
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

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CustomHttpResponse, EventState } from '../interface/custom-http-resposne';
import { Message } from '../interface/message';


@Injectable()
export class ReportService {
    constructor(private http: HttpClient) { }

    private server: string = 'http://localhost:8080';

    getUserEvent$ = (id: number) => <Observable<CustomHttpResponse<EventState>>>
        this.http.get<CustomHttpResponse<EventState>>(`${this.server}/user-event/get/${id}`)
            .pipe(
                tap(console.log),
                catchError(this.handleError)
            );

    report$ = (message: Message, id: number) => <Observable<CustomHttpResponse<EventState>>>
        this.http.post<CustomHttpResponse<EventState>>(`${this.server}/user-event/report/${id}`, message)
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

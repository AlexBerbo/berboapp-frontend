import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, BehaviorSubject, map, startWith, catchError, of, switchMap } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { EventType } from 'src/app/enum/event-type.enum';
import { Role } from 'src/app/enum/role.enum';
import { CustomHttpResponse, EventState } from 'src/app/interface/custom-http-resposne';
import { State } from 'src/app/interface/state';
import { NotificationService } from 'src/app/service/notification.service';
import { ReportService } from 'src/app/service/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportComponent implements OnInit {

  reportState$: Observable<State<CustomHttpResponse<EventState>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<EventState>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  readonly Role = Role;
  readonly EventType = EventType;
  private readonly USER_EVENT_ID: string = 'id';

  constructor(private activatedRoute: ActivatedRoute, private reportService: ReportService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.reportState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.reportService.getUserEvent$(+params.get(this.USER_EVENT_ID))
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
              return of({ dataState: DataState.ERROR, appState: this.dataSubject.value, error })
            })
          )
      })
    )
  }

  report(reportForm: NgForm) {
    this.isLoadingSubject.next(true);
    this.dataSubject.next({ ...this.dataSubject.value, message: '' })
    this.reportState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.reportState$ = this.reportService.report$(reportForm.value, +params.get(this.USER_EVENT_ID))
        .pipe(
          map(response => {
            this.notificationService.onDefault(response.message);
            console.log(response);
            reportForm.reset();
            this.isLoadingSubject.next(false);
            this.dataSubject.next({ ...response, 
              data: { ...response.data, 
              event: { ...response.data.event }}});
            return { dataState: DataState.LOADED, appData: this.dataSubject.value }
          }),
          startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
          catchError((error: string) => {
            this.notificationService.onDefault(error);
            this.isLoadingSubject.next(false);
            return of({ dataState: DataState.ERROR, appState: this.dataSubject.value, error })
          })
        )
      })
    )
  }
}

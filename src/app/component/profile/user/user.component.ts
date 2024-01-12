import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, BehaviorSubject, map, of, startWith, catchError } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { EventType } from 'src/app/enum/event-type.enum';
import { Role } from 'src/app/enum/role.enum';
import { CustomHttpResponse } from 'src/app/interface/custom-http-resposne';
import { Profile } from 'src/app/interface/profile';
import { State } from 'src/app/interface/state';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent implements OnInit {

  profileState$: Observable<State<CustomHttpResponse<Profile>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private showLogsSubject = new BehaviorSubject<boolean>(false);
  showLogs$ = this.showLogsSubject.asObservable();
  readonly DataState = DataState;
  readonly Role = Role;
  readonly EventType = EventType;

  constructor(private userService: UserService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.profileState$ = this.userService.profile$().pipe(map(response => {
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
  }

  updateUser(profileForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService.update$(profileForm.value).pipe(map(response => {
      this.notificationService.onDefault(response.message);
      console.log(response);
      this.dataSubject.next({ ...response, data: response.data }); // Copy what we had, and then add the new data
      this.isLoadingSubject.next(false);
      return { dataState: DataState.LOADED, appData: this.dataSubject.value }
    }),
      startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
      catchError((error: string) => {
        this.notificationService.onDefault(error);
        this.isLoadingSubject.next(false);
        return of({ dataState: DataState.LOADED, appState: this.dataSubject.value, error })
      })
    )
  }

  updatePassword(passwordForm: NgForm): void {
    this.isLoadingSubject.next(true);
    if (passwordForm.value.newPassword === passwordForm.value.confirmPassword) {
      this.profileState$ = this.userService.updatePassword$(passwordForm.value)
        .pipe(
          map(response => {
            this.notificationService.onDefault(response.message);
            console.log(response);
            passwordForm.reset();
            this.dataSubject.next({ ...response, data: response.data });
            this.isLoadingSubject.next(false);
            return { dataState: DataState.LOADED, appData: this.dataSubject.value }
          }),
          startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
          catchError((error: string) => {
            this.notificationService.onDefault(error);
            passwordForm.reset();
            this.isLoadingSubject.next(false);
            return of({ dataState: DataState.LOADED, appState: this.dataSubject.value, error })
          }))
    } else {
      console.log("Passwords do not match")
      passwordForm.reset();
      this.isLoadingSubject.next(false);
    }
  }

  updateRole(roleForm: NgForm) {
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService.updateRole$(roleForm.value.roleName).pipe(map(response => {
      this.notificationService.onDefault(response.message);
      console.log(response);
      this.dataSubject.next({ ...response, data: response.data }); // Copy what we had, and then add the new data
      this.isLoadingSubject.next(false);
      return { dataState: DataState.LOADED, appData: this.dataSubject.value }
    }),
      startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
      catchError((error: string) => {
        this.notificationService.onDefault(error);
        this.isLoadingSubject.next(false);
        return of({ dataState: DataState.LOADED, appState: this.dataSubject.value, error })
      })
    )
  }

  updateSettins(settingsForm: NgForm) {
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService.updateSettings$(settingsForm.value).pipe(map(response => {
      this.notificationService.onDefault(response.message);
      console.log(response);
      this.dataSubject.next({ ...response, data: response.data }); // Copy what we had, and then add the new data
      this.isLoadingSubject.next(false);
      return { dataState: DataState.LOADED, appData: this.dataSubject.value }
    }),
      startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
      catchError((error: string) => {
        this.notificationService.onDefault(error);
        this.isLoadingSubject.next(false);
        return of({ dataState: DataState.LOADED, appState: this.dataSubject.value, error })
      })
    )
  }

  updateMfa$() {
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService.updateMfa$().pipe(map(response => {
      this.notificationService.onDefault(response.message);
      console.log(response);
      this.dataSubject.next({ ...response, data: response.data }); // Copy what we had, and then add the new data
      this.isLoadingSubject.next(false);
      return { dataState: DataState.LOADED, appData: this.dataSubject.value }
    }),
      startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
      catchError((error: string) => {
        this.notificationService.onDefault(error);
        this.isLoadingSubject.next(false);
        return of({ dataState: DataState.LOADED, appState: this.dataSubject.value, error })
      })
    )
  }

  updateImage$(image: File) {
    if (image) {
      this.isLoadingSubject.next(true);
      this.profileState$ = this.userService.updateImage$(this.getFormData(image)).pipe(map(response => {
        this.notificationService.onDefault(response.message);
        console.log(response);
        this.dataSubject.next({
          ...response,
          data: { ...response.data,
          user: { ...response.data.user, imageUrl: `${response.data.user.imageUrl}?time=${new Date().getTime()}` }
          }
        }); // Copy what we had, and then add the new data
        this.isLoadingSubject.next(false);
        return { dataState: DataState.LOADED, appData: this.dataSubject.value }
      }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.notificationService.onDefault(error);
          this.isLoadingSubject.next(false);
          return of({ dataState: DataState.LOADED, appState: this.dataSubject.value, error })
        })
      )
    }
  }

  toggleActivities() {
    this.showLogsSubject.next(!this.showLogsSubject.value);
  }

  private getFormData(image: File): FormData {
    const formData = new FormData()
    formData.append('image', image);
    return formData;
  }
}

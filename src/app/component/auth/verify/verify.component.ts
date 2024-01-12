import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, BehaviorSubject, map, startWith, catchError, of, switchMap } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { AccountType, VerifyState } from 'src/app/interface/appstate';
import { User } from 'src/app/interface/user';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyComponent implements OnInit {
  verifyState$: Observable<VerifyState>;
  private userSubject = new BehaviorSubject<User>(null);
  user$ = this.userSubject.asObservable();
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  private ACCOUNT_KEY: string = 'key';

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.verifyState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        console.log(this.activatedRoute);
        const type: AccountType = this.getAccountType(window.location.href);
        return this.userService.verify$(type, params.get(this.ACCOUNT_KEY))
          .pipe(
            map(response => {
              this.notificationService.onDefault(response.message);
              console.log(response);
              type === 'password' ? this.userSubject.next(response.data.user) : null;
              return { type, title: 'Verified!', dataState: DataState.LOADED, message: response.message, verifySuccess: true };
            }),
            startWith({ title: 'Verifying...', dataState: DataState.LOADING, message: 'Please wait while we verify the information', verifySuccess: false }),
            catchError((error: string) => {
              this.notificationService.onDefault(error);
              return of({ title: error, dataState: DataState.ERROR, error, message: error, verifySuccess: false })
            })
          )
      })
    );
  }

  resetPassword(resetPasswordForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.verifyState$ = this.userService.resetPassword$({
      userId: this.userSubject.value.id,
      newPassword: resetPasswordForm.value.newPassword,
      confirmNewPassword: resetPasswordForm.value.confirmNewPassword
    })
      .pipe(
        map(response => {
          this.notificationService.onDefault(response.message);
          console.log(response);
          this.isLoadingSubject.next(false);
          return { type: 'account' as AccountType, title: 'Success!', dataState: DataState.LOADED, message: response.message, verifySuccess: true }
        }),
        startWith({ type: 'password' as AccountType, title: "Verified!", dataState: DataState.LOADED, verifySuccess: false }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          this.notificationService.onDefault(error);
          return of({ type: 'password' as AccountType, title: "Error!", dataState: DataState.LOADED, error, message: error, verifySuccess: true })
        })
      );
  }

  private getAccountType(url: string): AccountType {
    return url.includes('password') ? 'password' : 'account';
  }
}

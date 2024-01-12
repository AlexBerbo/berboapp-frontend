import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, of, map, startWith, catchError } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { RegisterState } from 'src/app/interface/appstate';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent {
  constructor(private userService: UserService, private notificationService: NotificationService) { }

  resetPasswordState$: Observable<RegisterState> = of({ dataState: DataState.LOADED });
  readonly DataState = DataState;

  resetPassword(resetPasswordFrom: NgForm): void {
    this.resetPasswordState$ = this.userService.sendPasswordResetRequest$(resetPasswordFrom.value.email)
      .pipe(
        map(response => {
          this.notificationService.onDefault(response.message);
          console.log(response);
          return { dataState: DataState.LOADED, registerSuccess: true, message: response.message };
        }),
        startWith({ dataState: DataState.LOADING, registerSuccces: false }),
        catchError((error: string) => {
          this.notificationService.onDefault(error);
          return of({ dataState: DataState.ERROR, registerSuccces: false, error })
        })
      );
  }
}

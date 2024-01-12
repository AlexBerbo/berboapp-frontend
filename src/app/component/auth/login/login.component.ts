import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of, startWith } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { Key } from 'src/app/enum/key.enum';
import { LoginState } from 'src/app/interface/appstate';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  loginState$: Observable<LoginState> = of({ dataState: DataState.LOADED });
  private phoneSubject = new BehaviorSubject<string | null>(null);
  private emailSubject = new BehaviorSubject<string | null>(null);
  readonly DataState = DataState;

  constructor(private router: Router, private userService: UserService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.userService.isUserAuthenticated() ? this.router.navigate(['/']) : this.router.navigate(['/login']);
  }

  login(loginForm: NgForm): void {
    this.loginState$ = this.userService.login$(loginForm.value.email, loginForm.value.password)
      .pipe(
        map(response => {
          if (response.data.user.usingMfa) {
            this.notificationService.onDefault(response.message);
            this.phoneSubject.next(response.data.user.phone);
            this.emailSubject.next(response.data.user.email);
            return {
              dataState: DataState.LOADED, isUsingMfa: true, loginSuccess: false,
              email: response.data.user.email
            };
          } else {
            this.notificationService.onDefault(response.message);
            localStorage.setItem(Key.TOKEN, response.data.jwt_token);
            localStorage.setItem(Key.REFRESH_TOKEN, response.data.refresh_token);
            console.log(localStorage.getItem(Key.REFRESH_TOKEN));
            this.router.navigate(['/']);
            return { dataState: DataState.LOADED, loginSuccess: true };
          }
        }),
        startWith({ dataState: DataState.LOADING, isUsingMfa: false }),
        catchError((error: string) => {
          this.notificationService.onDefault(error);
          return of({ dataState: DataState.ERROR, isUsingMfa: false, loginSuccess: false, error })
        })
      )
  }

  verifyCode(verifyCodeForm: NgForm): void {
    this.loginState$ = this.userService.verifyCode$(this.emailSubject.value, verifyCodeForm.value.code)
      .pipe(map(response => {
        localStorage.setItem(Key.TOKEN, response.data.jwt_token);
        localStorage.setItem(Key.REFRESH_TOKEN, response.data.refresh_token);
        this.router.navigate(['/']);
        return { dataState: DataState.LOADED, loginSuccess: true };
      }),
        startWith({ dataState: DataState.LOADING, isUsingMfa: true, loginSuccess: false, email: this.emailSubject.value }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, isUsingMfa: true, loginSuccess: false, error, email: this.emailSubject.value })
        })
      )
  }

  loginPage(): void {
    this.loginState$ = of({ dataState: DataState.LOADED });
  }
}

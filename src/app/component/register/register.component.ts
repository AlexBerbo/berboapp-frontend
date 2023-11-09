import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { RegisterState } from 'src/app/interface/appstate';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private userService: UserService) {}

  registerState$: Observable<RegisterState> = of({ dataState: DataState.LOADED });
  readonly DataState = DataState;

  register(registerFrom: NgForm): void {
    this.registerState$ = this.userService.register$(registerFrom.value)
    .pipe(
      map(response => {
        console.log(response);
        return { dataState: DataState.LOADED, registerSuccess: true, message: response.message };
      }),
      startWith({ dataState: DataState.LOADING, registerSuccces: false }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR, registerSuccces: false, error })
      })
    );
  }

  createAnotherAccount(): void {
    this.registerState$ = of({ dataState: DataState.LOADED, registerSuccess: false });
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, map, of, startWith, catchError } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomHttpResponse } from 'src/app/interface/custom-http-resposne';
import { Profile } from 'src/app/interface/profile';
import { State } from 'src/app/interface/state';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileState$: Observable<State<CustomHttpResponse<Profile>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile>>(null);
  readonly DataState = DataState;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.profileState$ = this.userService.profile$().pipe(map(response => {
      console.log(response);
      this.dataSubject.next(response);
      return { dataState: DataState.LOADED, appData: response }
    }),
      startWith({ dataState: DataState.LOADING }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR, appState: this.dataSubject.value, error })
      })
    )
  }
}

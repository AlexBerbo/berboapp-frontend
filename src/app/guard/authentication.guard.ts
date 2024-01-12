import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../service/user.service';
import { Key } from '../enum/key.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.isUserAuthenticated();
  }

  isUserAuthenticated(): boolean {
    if(this.userService.isUserAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      localStorage.removeItem(Key.TOKEN);
      localStorage.removeItem(Key.REFRESH_TOKEN);
      return false;
    }
  }
}

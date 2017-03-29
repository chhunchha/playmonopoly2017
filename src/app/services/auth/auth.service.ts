import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders } from 'angularfire2';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UsersService } from '../users/users.service';

import * as _ from 'lodash';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  user;
  userChange: BehaviorSubject<any> = new BehaviorSubject<any>({});
  userChangeAnnounced$ = this.userChange.asObservable();

  constructor(
    public af: AngularFire,
    public usersService: UsersService,
    private router: Router) {

    this.af.auth.subscribe(user => {
      if (user) {
        // user logged in
        this.user = user;
        if (!usersService.userExists(this.user.uid)) {
          const newUser = {};
          newUser[this.user.uid] = this.user.auth.providerData[0];
          // newUser = { 
          //   displayName: this.user.auth.displayName,
          //   email: this.user.auth.email,
          //   photoURL: this.user.auth.photoURL,
          // }
          usersService.add(newUser);
          this.router.navigate(['/board']);
        }
        // console.log(this.user);
      } else {
        // user not logged in
        this.user = null;
      }
      this.userChange.next(this.user);
    });
  }

  login() {
    this.af.auth.login({
      provider: AuthProviders.Google
    });
  }

  logout() {
    this.af.auth.logout();
    this.router.navigate(['/']);
  }

  isAuthenticated() {
    return this.user != null && !_.isEmpty(this.user);
  }

  getCurrentUser() {
    return this.user;
  }

}

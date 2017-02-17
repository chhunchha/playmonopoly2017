import { Injectable } from "@angular/core";
import { AngularFire, AuthProviders } from 'angularfire2';
import { Subject }    from 'rxjs/Subject';
import { UsersService } from '../users/users.service';

import * as _ from "lodash";

@Injectable()
export class AuthService {
  user;
  userChange: Subject<any> = new Subject<any>();
  userChangeAnnounced$ = this.userChange.asObservable();

  constructor(
    public af: AngularFire, 
    public usersService: UsersService) {

    this.af.auth.subscribe(user => {
      if (user) {
        // user logged in
        this.user = user;
        if(!usersService.userExists(this.user.uid)) {
            let newUser = {}
            newUser[this.user.uid] = this.user.auth.providerData[0];
            // newUser = { 
            //   displayName: this.user.auth.displayName,
            //   email: this.user.auth.email,
            //   photoURL: this.user.auth.photoURL,
            // }
            usersService.add(newUser);
        } 
        // console.log(this.user);
      }
      else {
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
  }

  isAuthenticated() {
    return this.user != null && !_.isEmpty(this.user);
  }

  getCurrentUser() {
    return this.user;
  }

}

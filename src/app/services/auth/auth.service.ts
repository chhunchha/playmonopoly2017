import { Injectable } from "@angular/core";
import { AngularFire, AuthProviders } from 'angularfire2';
import { Subject }    from 'rxjs/Subject';

import * as _ from "lodash";

@Injectable()
export class AuthService {
  user = {};
  userChange: Subject<any> = new Subject<any>();
  userChangeAnnounced$ = this.userChange.asObservable();

  constructor(public af: AngularFire) {


    this.af.auth.subscribe(user => {
      if (user) {
        // user logged in
        this.user = user;
        console.log(this.user);
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

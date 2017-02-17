import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

@Injectable()
export class UsersService {

  users: FirebaseObjectObservable<any>;
  constructor(public af: AngularFire) { 
    this.users = this.getUsers();
  }

  getUsers() {
    return this.af.database.object('/users');
  }

  add(newUser) {
    this.users.update(newUser);
  }

  userExists(uid) {
    return this.users[uid] != undefined;
  }
}

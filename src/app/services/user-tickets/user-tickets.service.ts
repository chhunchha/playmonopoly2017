import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserTicketsService {

  all_users_tickets: FirebaseListObservable<any[]>;
  user_tickets: FirebaseObjectObservable<any[]>;
  currentUser: any;

  constructor(public af: AngularFire, public authService: AuthService) {
    authService.userChangeAnnounced$.subscribe(user =>
      this.currentUser = this.authService.user
    );
  }

  getUserTickets() {
    if (this.authService.isAuthenticated()) {
      this.user_tickets = this.af.database.object('user_tickets/' + this.currentUser.uid);
      // console.log(this.user_tickets);
      // console.log(this.currentUser.uid);
      return this.user_tickets;
    }
  }

  getAllUsersTickets() {
    if (this.authService.isAuthenticated()) {
      return this.af.database.object('user_tickets/');
    }
  }
}

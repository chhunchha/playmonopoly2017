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

  getUserTicketsList() {
        if (this.authService.isAuthenticated()) {
          return this.af.database.list('user_tickets/' + this.currentUser.uid);
      }
  }

  getUserTickets() {
    if (this.authService.isAuthenticated()) {
      this.user_tickets = this.af.database.object('user_tickets/' + this.currentUser.uid);
      return this.user_tickets;
    }
  }

  getUserTicketsById(id) {
    if (this.authService.isAuthenticated()) {
      return this.af.database.list('user_tickets/' + id);
    }
  }

  getAllUsersTickets() {
    if (this.authService.isAuthenticated()) {
      return this.af.database.object('user_tickets/');
    }
  }
}

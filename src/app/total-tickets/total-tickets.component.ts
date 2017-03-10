import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth/auth.service';
import { UserTicketsService } from '../services/user-tickets/user-tickets.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-total-tickets',
  templateUrl: './total-tickets.component.html',
  styleUrls: ['./total-tickets.component.css']
})
export class TotalTicketsComponent implements OnInit {
  total_tickets = 0;
  all_users_tickets: any;

  constructor(
    public authService: AuthService,
    public userTicketsService: UserTicketsService
  ) {
    authService.userChangeAnnounced$.subscribe(user => {
      if (this.authService.isAuthenticated()) {
        this.userTicketsService.getAllUsersTickets()
          .subscribe(all_users_tickets => {
            this.all_users_tickets = all_users_tickets;
            this.total_tickets = 0;
            _.mapKeys(this.all_users_tickets, (tickets: any, uid) => {
              _.mapKeys(tickets, (no: number, ticket) => {
                if (no > 0) {
                  this.total_tickets += no;
                }
              });
            });
          });
      }
    });
  }

  ngOnInit() {

  }
}

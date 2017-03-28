import { Component, OnInit } from '@angular/core';
import { BoardService } from 'app/services/board/board.service';
import { AuthService } from 'app/services/auth/auth.service';
import { UserTicketsService } from 'app/services/user-tickets/user-tickets.service';
import { TicketsService } from 'app/services/tickets/tickets.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'app/services/users/users.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.css']
})
export class ExchangeComponent implements OnInit {

  currentUser: any;
  board: any;
  user_tickets: any;
  tickets: any;
  all_users_tickets: any;
  users: any;
  other_user_tickets: any;
  selectedUser: any;
  hide_common = false;

  total_tickets_of_other_user = 0;

  constructor(public boardService: BoardService,
    public authService: AuthService,
    public userTicketsService: UserTicketsService,
    public ticketsService: TicketsService,
    private modalService: NgbModal,
    public usersService: UsersService) {

    authService.userChangeAnnounced$.subscribe(user => {
      this.currentUser = this.authService.user;
      if (this.authService.isAuthenticated()) {

        this.boardService.getBoardData()
          .subscribe(board => {
            this.board = _.reverse(board);
          });

        this.userTicketsService.getUserTicketsList()
          .subscribe(user_tickets => {
            this.user_tickets = _.filter(user_tickets,
              function (ticket) {
                return ticket.$value > 0;
              });
          });

        this.userTicketsService.getAllUsersTickets()
          .subscribe(all_users_tickets => {
            this.all_users_tickets = all_users_tickets;
          });

        this.ticketsService.getTickets()
          .subscribe(tickets => {
            this.tickets = tickets;
          });

        this.usersService.getUsersArray()
          .subscribe(users => {
            this.users = _.sortBy(users, user => user.email);
          });
      }
    });
  }

  ngOnInit() {
  }


  selectUser(user) {
    if (user.uid) {
      this.selectedUser = user;
      this.total_tickets_of_other_user = 0;
      this.userTicketsService.getUserTicketsById(user.$key)
        .subscribe(other_user_tickets => {
          this.other_user_tickets = _.filter(other_user_tickets,
            (ticket) => {
              this.total_tickets_of_other_user += ticket.$value;
              return ticket.$value > 0;
            });

          this.canOffer();
        }
        );
    }
  }

  canOffer() {
    this.other_user_tickets.forEach((ticket: any) => {
      ticket.canOffer = _.findIndex(this.user_tickets, (u_ticket: any) => {
        return u_ticket.$key === ticket.$key;
      });
    });

    this.user_tickets.forEach((ticket: any) => {
      ticket.canOffer = _.findIndex(this.other_user_tickets, (u_ticket: any) => {
        return u_ticket.$key === ticket.$key;
      });
    });
  }
}

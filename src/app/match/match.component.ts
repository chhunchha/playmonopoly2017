import { Component, OnInit } from '@angular/core';
import { BoardService } from '../services/board/board.service';
import { UserTicketsService } from '../services/user-tickets/user-tickets.service';
import { AuthService } from '../services/auth/auth.service';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { TicketsService } from '../services/tickets/tickets.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../services/users/users.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {

  currentUser: any;
  board: any;
  user_tickets: any;
  tickets: any;
  all_users_tickets: any;
  all_matches: any;
  searched = false;
  default_match_button_label = 'Find Tickets';
  match_button_label = this.default_match_button_label;
  closeResult: string;
  message: any = {};
  prizes_can_be_won: any;

  constructor(
    public boardService: BoardService,
    public authService: AuthService,
    public userTicketsService: UserTicketsService,
    public ticketsService: TicketsService,
    private modalService: NgbModal,
    public usersService: UsersService
  ) {
    this.all_matches = [];
    this.prizes_can_be_won = [];
    authService.userChangeAnnounced$.subscribe(user => {
      this.currentUser = this.authService.user;
      if (this.authService.isAuthenticated()) {

        this.boardService.getBoardData()
          .subscribe(board => {
            this.board = _.reverse(board);
            //console.log(JSON.stringify(this.board));
          });

        this.userTicketsService.getUserTickets()
          .subscribe(user_tickets => {
            this.user_tickets = user_tickets;
            //console.log(JSON.stringify(this.user_tickets));
          });

        this.userTicketsService.getAllUsersTickets()
          .subscribe(all_users_tickets => {
            this.all_users_tickets = all_users_tickets;
            //console.log('all : ' + JSON.stringify(this.all_users_tickets));
          });

        this.ticketsService.getTickets()
          .subscribe(tickets => {
            this.tickets = tickets;
            //console.log(JSON.stringify(this.tickets));
          });
      }
    });
  }

  ngOnInit() {

  }

  findPrizeForTicket(ticket): any {
    return _.find(this.board, ['$key', this.tickets[ticket].prize]) || null;
  }

  getMissingTickets() {
    this.searched = false;
    this.match_button_label = this.default_match_button_label;
    // Get all ticket codes from tickets data
    const all_ticket_codes = Object.keys(this.tickets);

    // Getting ticket codes which user has 1 or more
    const user_has_tickets = [];
    _.mapKeys(this.user_tickets, (value, key) => {
      if (value > 0) {
        user_has_tickets.push(key);
      }
    });

    _.mapKeys(this.user_tickets, (value, key) => {
      if (value > 0) {
        user_has_tickets.push(key);
      }
    });
    console.log('User has: ' + user_has_tickets);

    const user_has_tickets_filter = _.filter(this.all_users_tickets, (value, key) => {
      return value > 0;
    });

    console.log('User has (filter): ' + user_has_tickets_filter);

    console.log('User has: ' + user_has_tickets);

    // Getting ticket codes which user doesn't have , filtering from all ticket codes.
    const user_doesnt_have: any = _.filter(all_ticket_codes, (ticket) => {
      return _.indexOf(user_has_tickets, ticket) === -1 && ticket !== '$key';
    });
    console.log('User doesn\'t have: ' + user_doesnt_have);

    // searching through all of tickets of all the users which are missing for this user.
    const all_available_tickets: any = {};
    _.mapKeys(this.all_users_tickets, (tickets, uid) => {
      const user_tickets: any = tickets;
      _.mapKeys(user_tickets, (no, ticket) => {
        if (no > 0 && _.indexOf(user_doesnt_have, ticket) !== -1) {
          if (all_available_tickets[ticket] === undefined) {
            all_available_tickets[ticket] = { users: [uid] };
          } else {
            all_available_tickets[ticket].users.push(uid);
          }
        }
      });
    });

    // setting prize of those tickets found
    _.forEach(all_available_tickets, (details, ticket) => {
      let prize: any;
      prize = this.findPrizeForTicket(ticket);
      details.prize = prize.name;
      details.order = prize.order;
      details.rare = this.tickets[ticket].rare;
    });

    // sorting tickets by order of their prize to display
    this.all_matches = _.sortBy(
      _.toPairs(all_available_tickets),
      (ele) => {
        return ele[1].order;
      }).reverse();
    console.log(this.all_matches);

    this.searched = true;
    this.match_button_label = 'Refresh';

    this.which_prize_can_be_won();
  }

  show_user_details(match, content) {
    this.message.title = 'Below users have ' + match[0] + '.';
    this.message.text = '<ul>';
    _.forEach(match[1].users, (uid) => {
      this.usersService.getUser(uid)
        .subscribe(user => this.message.text += '<li>' + user.email + '</li>');
    });

    this.open(content);
  };

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  which_prize_can_be_won() {
    const all_available_tickets: any = {};
    _.mapKeys(this.all_users_tickets, (tickets: any, uid) => {
      _.mapKeys(tickets, (no, ticket) => {
        if (no > 0) {
          if (all_available_tickets[ticket] === undefined) {
            all_available_tickets[ticket] = { users: [uid] };
          } else {
            all_available_tickets[ticket].users.push(uid);
          }
        }
      });
    });

    this.prizes_can_be_won = [];
    _.forEach(this.board, (prize: any) => {
      let can_be_won = true;
      const temp: any = { tickets: {} };
      _.forEach(prize.tickets, (ticket) => {
        if (all_available_tickets[ticket] === undefined) {
          can_be_won = false;
          return;
        } else {
          temp.tickets[ticket] = all_available_tickets[ticket];
        }
      });
      if (can_be_won) {
        temp.prize = prize.name;
        this.prizes_can_be_won.push(temp);
      }
    });
    console.log(this.prizes_can_be_won);
  };

  win_details(win, content) {
    this.message.title = 'Below users can win ' + win.prize;
    this.message.text = '<table class=\"table\"><tr><th>Ticket</th><th>Email</th></tr>';
    _.forEach(win.tickets, (obj, ticket) => {
      _.forEach(obj.users, (uid) => {
        this.usersService.getUser(uid)
          .subscribe(user => {
            this.message.text += '<tr>';
            this.message.text += '<td>' + ticket + '</td>';
            this.message.text += '<td>' + user.email + '</td>';
            this.message.text += '</tr>';
          });
      });
    });
    this.open(content);
  };
}

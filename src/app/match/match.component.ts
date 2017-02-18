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
  message = {};

  constructor(
    public boardService: BoardService,
    public authService: AuthService,
    public userTicketsService: UserTicketsService,
    public ticketsService: TicketsService,
    private modalService: NgbModal,
    public usersService: UsersService
  ) {
    this.all_matches = [];
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
    _.mapKeys(this.user_tickets, function (value, key) {
      if (value > 0) {
        user_has_tickets.push(key);
      }
    });
    console.log('User has: ' + user_has_tickets);

    // Getting ticket codes which user doesn't have , filtering from all ticket codes.
    const user_doesnt_have: any = _.filter(all_ticket_codes, function (ticket) {
      return _.indexOf(user_has_tickets, ticket) === -1 && ticket !== '$key';
    });
    console.log('User doesn\'t have: ' + user_doesnt_have);

    // Getting people with missing tickets, searching through all of tickets or all of the users
    const all_available_tickets: any = {};
    _.mapKeys(this.all_users_tickets, function (tickets, uid) {
      const user_tickets: any = tickets;
      const that = this;
      _.mapKeys(user_tickets, function (no, ticket) {
        if (no > 0 && _.indexOf(user_doesnt_have, ticket) !== -1) {
          if (all_available_tickets[ticket] === undefined) {
            all_available_tickets[ticket] = {users: [uid]};
          } else {
            all_available_tickets[ticket].users.push(uid);
          }
        }
      });
    });

    // setting prize of those tickets found
    const that = this;
    _.forEach(all_available_tickets, function (details, ticket) {
      let prize: any;
      prize = that.findPrizeForTicket(ticket);
      details.prize = prize.name;
      details.order = prize.order;
    })

    // sorting tickets by order of their prize to display
    this.all_matches = _.sortBy(
      _.toPairs(all_available_tickets),
      function (ele) {
        return ele[1].order;
      }).reverse();
    console.log(all_available_tickets);

    this.searched = true;
    this.match_button_label = 'Refresh';
  }

  show_user_details = function(match, content) {
    const that = this;
    this.message.title = 'Below users have ' + match[0] + '.';
    this.message.text = '<ul>';
    _.forEach(match[1].users, function(uid) {
        that.usersService.getUser(uid)
        .subscribe(user => that.message.text += '<li>' + user.email + '</li>');
    });

    this.open(content);
  }

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

}

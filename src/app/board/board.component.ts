import { Component, OnInit } from '@angular/core';
import { BoardService } from '../services/board/board.service';
import { UserTicketsService } from '../services/user-tickets/user-tickets.service';
import { AuthService } from '../services/auth/auth.service';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { TicketsService } from '../services/tickets/tickets.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import * as _ from 'lodash';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  currentUser: any;
  board: any;
  user_tickets: any;
  userTicketsObservable: FirebaseObjectObservable<any[]>;
  tickets: FirebaseObjectObservable<any[]>;
  closeResult: string;
  message: {};

  constructor(
    public boardService: BoardService,
    public authService: AuthService,
    public userTicketsService: UserTicketsService,
    public ticketsService: TicketsService,
    private modalService: NgbModal
  ) {
    authService.userChangeAnnounced$.subscribe(user => {
      this.currentUser = this.authService.user;
      // this.board = this.boardService.getBoardData();
      if (this.authService.isAuthenticated()) {
        this.userTicketsObservable = this.userTicketsService.getUserTickets();

        this.boardService.getBoardData()
          .subscribe(board => this.board = _.reverse(board));

        this.userTicketsService.getUserTickets()
          .subscribe(user_tickets => this.user_tickets = user_tickets);

        this.ticketsService.getTickets()
          .subscribe(tickets => this.tickets = tickets);
      }
    });
  }

  ngOnInit() {
  }

  findPrizeForTicket(ticket): any {
    return _.find(this.board, ['$key', this.tickets[ticket].prize]) || null;
  }


  increment(ticket, content) {
    const emailLink = '<a href=\'mailto:playsafewaymonopolytogether@gmail.com?Subject=Monopoly ticket\' target=\'_top\'>Email</a>';
    const newTicket = {};
    if (this.tickets[ticket].rare) {
      if (this.findPrizeForTicket(ticket).value < 500) {
        this.message = {
          title: 'Congratulations!!',
          text: 'You got the rare to find ticket!!'
        };
        this.open(content);
      } else if (this.findPrizeForTicket(ticket).value < 2000) {
        this.message = {
          title: 'Congratulations!!',
          text: 'You got the rare to find ticket!! would like to support this website? contact via'  + emailLink + ' to know how.'
        };
        this.open(content);
      } else {
        this.message = {
          title: 'Wow!!',
          text: 'That is a hard to find ticket. ' + emailLink + ' a picture of ticket and will update it. This is to keep data accurate.'
        };
        this.open(content);
        return;
      }
    }
    if (this.user_tickets[ticket] !== undefined) {
      newTicket[ticket] = this.user_tickets[ticket] + 1;
    } else {
      newTicket[ticket] = 1;
    }
    this.updateTicket(newTicket);
  }

  decrement(ticket) {
    const newTicket = {};
    if (this.user_tickets[ticket] !== undefined && this.user_tickets[ticket] > 0) {
      newTicket[ticket] = this.user_tickets[ticket] - 1;
      this.updateTicket(newTicket);
    }
  }

  updateTicket(ticket) {
    const promise = this.userTicketsObservable.update(ticket);
    promise
      .then(_ => console.log('success'))
      .catch(err => console.log(err));
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

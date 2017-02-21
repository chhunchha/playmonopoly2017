import { Component, OnInit } from '@angular/core';
import { UserTicketsService } from '../services/user-tickets/user-tickets.service';
import { AuthService } from '../services/auth/auth.service';
import { UsersService } from '../services/users/users.service'
import * as _ from 'lodash';

@Component({
  selector: 'app-misc',
  templateUrl: './misc.component.html',
  styleUrls: ['./misc.component.css']
})
export class MiscComponent implements OnInit {

  all_users_tickets: any;
  user_total_tickets = [];
  total_tickets = 0;
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartLabels: string[] = [];
  public barChartData: any[] = [
    { data: [], label: 'Total Tickets' }
  ];

  constructor(
    public authService: AuthService,
    public userTicketsService: UserTicketsService,
    public usersService: UsersService
  ) {
    authService.userChangeAnnounced$.subscribe(user => {
      if (this.authService.isAuthenticated()) {
        this.userTicketsService.getAllUsersTickets()
          .subscribe(all_users_tickets => this.all_users_tickets = all_users_tickets);

          this.prepareChartDataForTicketsOfEachUser();
      }
    });
  }

  ngOnInit() {
  }

  getTotalTicketsOfEachUser(): any {
    this.userTicketsService.getAllUsersTickets()
      .subscribe(all_users_tickets => {
        this.all_users_tickets = all_users_tickets;
        _.forEach(this.all_users_tickets, (tickets: any, uid) => {
          let sum = 0;
          _.forEach(tickets, (no, ticket) => {
            sum += no;
          });
          this.user_total_tickets.push(uid, sum);

        });
        console.log(this.user_total_tickets);

      });
  }

  prepareChartDataForTicketsOfEachUser(): any {

    let labels = [];
    let data = [
      { data: [], label: 'Total Tickets' }
    ];

    this.total_tickets = 0;
    _.forEach(this.all_users_tickets, (tickets: any, uid) => {
      if (uid.length >= 28) {
        this.usersService.getUser(uid)
          .subscribe(user => {
            if (user !== undefined) { }
            let sum = 0;
            _.forEach(tickets, (no, ticket) => {
              sum += no;
            });
            data[0].data.push(sum);

            this.total_tickets += sum;
            labels.push(user.email);
          });
      }
    });

    let clone = JSON.parse(JSON.stringify(data));
    this.barChartData = clone;
    clone = JSON.parse(JSON.stringify(labels));
    this.barChartLabels = labels;
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
// import { MaterialModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import 'lodash';
import 'hammerjs';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { AuthService } from './services/auth/auth.service';
import { BoardComponent } from './board/board.component';
import { BoardService } from './services/board/board.service';
import { UserTicketsService } from './services/user-tickets/user-tickets.service';
import { TicketsService } from './services/tickets/tickets.service';
import { UsersService } from './services/users/users.service';


import * as _ from 'lodash';
import { TicketFilterPipe } from './pipes/ticket-filter.pipe';
import { IntroductionComponent } from './introduction/introduction.component';
import { MatchComponent } from './match/match.component';
import { MailchimpComponent } from './mailchimp/mailchimp.component';
import { MatchFilterPipe } from './pipes/match-filter.pipe';
import { TotalTicketsComponent } from './total-tickets/total-tickets.component';
import { ExchangeComponent } from './exchange/exchange.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth/auth-guard.service';

// Must export the config
export const firebaseConfig = {
  apiKey: 'AIzaSyCvwr8B_blAMSu0UF9XmWqNZoyPn7cq5bY',
  authDomain: 'playmonopoly2017.firebaseapp.com',
  databaseURL: 'https://playmonopoly2017.firebaseio.com/',
  storageBucket: 'gs://playmonopoly2017.appspot.com',
  messagingSenderId: '579170967880'
};

const authConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Popup
};

const appRoutes: Routes = [
  { path: 'board', component: BoardComponent, canActivate: [AuthGuard] },
  { path: 'match', component: MatchComponent, canActivate: [AuthGuard] },
  { path: 'exchange', component: ExchangeComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    BoardComponent,
    TicketFilterPipe,
    IntroductionComponent,
    MatchComponent,
    MailchimpComponent,
    MatchFilterPipe,
    TotalTicketsComponent,
    ExchangeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    // MaterialModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig, authConfig, 'playmonopoly2017'),
  ],
  providers: [AuthService, BoardService, UserTicketsService, TicketsService, UsersService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }

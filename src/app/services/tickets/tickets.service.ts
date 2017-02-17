import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

@Injectable()
export class TicketsService {

  constructor(public af: AngularFire) { 
    this.getTickets();
  }

  getTickets() {
    return this.af.database.object('/ticket');
  }
}

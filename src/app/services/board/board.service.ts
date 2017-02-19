import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class BoardService {

  board: FirebaseListObservable<any[]>;
  constructor(public af: AngularFire) { }

  getBoardData() {
    this.board = this.af.database.list('/prize', {
      query: {
        orderByChild: 'order'
      }
    });
    return this.board;
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'ticketFilter'
})
export class TicketFilterPipe implements PipeTransform {

  transform(items: any[], args?: any): any {
    if (items && args) {
      return items
        .filter(item => {
          if (item.tickets !== undefined) {
            return _.some(item.tickets, _.unary(_.partialRight(_.includes, _.toUpper(args))));
          } else {
            return item.indexOf(_.toUpper(args)) !== -1;
          }
        })
    } else {
      return items;
    }
    //      return items.filter(item => _.indexOf(item.tickets, args) !== -1);
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'matchFilter'
})
export class MatchFilterPipe implements PipeTransform {

  transform(items: any[], args?: any): any {
    if (items && args) {
      return items
        .filter(item => {
            return item[0].indexOf(_.toUpper(args)) !== -1 || _.toUpper(item[1].prize).indexOf(_.toUpper(args)) !== -1;
        });
    } else {
      return items;
    }
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractValue'
})
export class ExtractValuePipe implements PipeTransform {

  transform(value: any, args: string): unknown {
    let total: number = 0;
    if(args === 'number') {
      let numberArray: number[] = [];
      for(let i = 0; i < value; i++) {
        numberArray.push(i);
      }
      return numberArray;
    }
    if(args === 'invoices') {
      value.forEach(invoices => {
        total += invoices.total;
      });
      return total.toFixed(2);
    }
    return 0;
  }

}

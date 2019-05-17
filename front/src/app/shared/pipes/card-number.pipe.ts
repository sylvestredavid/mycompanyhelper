import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'cardNumber'
})
export class CardNumberPipe implements PipeTransform {

    transform(value: string): string {
        if (value) {
            if (value.length === 19) {
                return value;
            }
            if (value.match(/([0-9]{4})$/g)) {
                return value + ' ';
            } else {
                return value;
            }
        } else {
            return '';
        }
    }

}

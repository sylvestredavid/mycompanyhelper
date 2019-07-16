import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dateFr'
})
export class DateFrPipe implements PipeTransform {

    transform(date: Date): string {
        const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'décembre'];

        return date.getDate() + ' ' + mois[date.getMonth()] + ' ' + date.getFullYear();
    }

}

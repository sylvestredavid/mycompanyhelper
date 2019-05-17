import {Component, OnInit} from '@angular/core';
import {CalendrierModel} from '../../../models/calendrier.model';
import {CalendrierService} from '../../calendrier/calendrier.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';

@Component({
    selector: 'app-liste-calendrier',
    templateUrl: './liste-calendrier.component.html',
    styleUrls: ['./liste-calendrier.component.scss']
})
export class ListeCalendrierComponent implements OnInit {

    events: CalendrierModel[];

    options;

    constructor(private calendrierService: CalendrierService) {
    }

    ngOnInit() {

        this.calendrierService.calendrierListe$.subscribe(
            c => this.events = c
        );
        this.options = {
            plugins: [listPlugin],
            defaultView: 'listDay',
            defaultDate: new Date(),
            locale: frLocale,
            allDaySlot: false,
            header: {
                left: '',
                center: 'title',
                right: ''
            }
        };
    }

}

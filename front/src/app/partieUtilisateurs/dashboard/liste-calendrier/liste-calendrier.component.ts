import {Component, OnInit} from '@angular/core';
import {CalendrierModel} from '../../../models/calendrier.model';
import {CalendrierService} from '../../calendrier/calendrier.service';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';

@Component({
    selector: 'app-liste-calendrier',
    templateUrl: './liste-calendrier.component.html',
    styleUrls: ['./liste-calendrier.component.scss']
})
export class ListeCalendrierComponent implements OnInit {

    events: CalendrierModel[];
    date: Date;

    options;

    constructor(private calendrierService: CalendrierService) {
    }

    ngOnInit() {
        this.date = new Date();

        this.calendrierService.calendrierListe$.subscribe(
            c => this.events = c
        );
    }

}

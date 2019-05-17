import {Component, OnInit} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import {NotificationsService} from '../../notification/notifications.service';
import {DatePipe} from '@angular/common';
import {CalendrierModel} from '../../../models/calendrier.model';
import {CalendrierService} from '../calendrier.service';
import {MatDialog} from '@angular/material';
import {CheckoutAbonnementFournisseurComponent} from '../../../users/checkout-abonnement-fournisseur/checkout-abonnement-fournisseur.component';
import {CalendrierDialComponent} from './calendrier-dial/calendrier-dial.component';
import listPlugin from '@fullcalendar/list';
import {UsersService} from '../../../users/users.service';
import {SocketService} from '../../../shared/socket.service';

@Component({
    selector: 'app-calendrier',
    templateUrl: './calendrier.component.html',
    styleUrls: ['./calendrier.component.scss']
})
export class CalendrierComponent implements OnInit {
    events: CalendrierModel[];

    options;

    constructor(private datePipe: DatePipe, private calendrierService: CalendrierService, public dialog: MatDialog,
                private socket: SocketService, private userService: UsersService) {
    }

    ngOnInit() {
        this.initSocket()
        this.calendrierService.calendrierListe$.subscribe(
            c => this.events = c
        );
        this.options = {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
            defaultDate: new Date(),
            locale: frLocale,
            businessHours: {daysOfWeek: [1, 2, 3, 4, 5]},
            allDaySlot: false,
            header: {
                left: 'prev, next',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay, listMonth'
            },
            dateClick: (e) => {
                console.log(e)
                const dialogRef = this.dialog.open(CalendrierDialComponent, {
                    width: '500px', data: {start: e.dateStr}
                });
                dialogRef.afterClosed().subscribe((result: CalendrierModel) => {
                        if (result) {
                            const c: CalendrierModel = {
                                title: result.title,
                                start: result.start,
                                end: result.end,
                                idUser: this.userService.idUser
                            };
                            this.calendrierService.saveCalendrier(c).subscribe(
                                cal => {
                                    this.calendrierService.pushCalendrier(cal);
                                    this.events = [...this.events];
                                    this.socket.ajoutCalendrier(cal);
                                }
                            );
                        }
                    }
                );
            },
            eventDrop: (e) => {
                const c: CalendrierModel = {
                    id: +e.event.id,
                    title: e.event.title,
                    start: this.datePipe.transform(e.event.start, 'yyyy-MM-ddTHH:mm:ss'),
                    end: e.event.end !== null ? this.datePipe.transform(e.event.end, 'yyyy-MM-ddTHH:mm:ss') : null,
                    idUser: this.userService.idUser
                };
                this.calendrierService.modifCalendrier(c).subscribe(
                    cal => {
                        this.calendrierService.updateCalendrier(cal);
                        this.events = [...this.events];
                        this.socket.modifCalendrier(cal);
                    }
                );
            },
            eventClick: (e) => {
                const c: CalendrierModel = {
                    id: +e.event.id,
                    title: e.event.title,
                    start: this.datePipe.transform(e.event.start, 'yyyy-MM-ddTHH:mm:ss'),
                    end: e.event.end !== null ? this.datePipe.transform(e.event.end, 'yyyy-MM-ddTHH:mm:ss') : null,
                    idUser: this.userService.idUser
                };
                const dialogRef = this.dialog.open(CalendrierDialComponent, {
                    width: '500px', data: {calendrier: c}
                });
                dialogRef.afterClosed().subscribe((result: any) => {
                        if (result) {
                            if (result === 'supprimer') {
                                this.calendrierService.deleteCalendrier(c.id).subscribe(
                                    () => {
                                        this.calendrierService.removeCalendrier(c.id)
                                        this.socket.deleteCalendrier(c.id);
                                    }
                                );
                            } else {

                                this.calendrierService.modifCalendrier(result).subscribe(
                                    cal => {
                                        this.calendrierService.updateCalendrier(cal);
                                        this.socket.modifCalendrier(cal);
                                    }
                                );
                            }
                            this.events = [...this.events];
                        }
                    }
                );
            },
            eventResize: (e) => {
                const c: CalendrierModel = {
                    id: +e.event.id,
                    title: e.event.title,
                    start: this.datePipe.transform(e.event.start, 'yyyy-MM-ddTHH:mm:ss'),
                    end: e.event.end !== null ? this.datePipe.transform(e.event.end, 'yyyy-MM-ddTHH:mm:ss') : null,
                    idUser: this.userService.idUser
                };
                this.calendrierService.modifCalendrier(c).subscribe(
                    cal => {
                        this.calendrierService.updateCalendrier(cal);
                        this.events = [...this.events];
                        this.socket.modifCalendrier(cal);
                    }
                );
            },
            editable: true
        };
    }

    private initSocket() {
        this.socket.getAjoutCalendrier().subscribe(
            data => {
                if (data.idUser === this.userService.idUser) {
                    this.calendrierService.pushCalendrier(data.calendrier);
                    this.events = [...this.events];
                }
            }
        );
        this.socket.getModifCalendrier().subscribe(
            data => {
                if (data.idUser === this.userService.idUser) {
                    this.calendrierService.updateCalendrier(data.calendrier);
                    this.events = [...this.events];
                }
            }
        );
        this.socket.getDeleteCalendrier().subscribe(
            data => {
                if (data.idUser === this.userService.idUser) {
                    this.calendrierService.removeCalendrier(data.id);
                    this.events = [...this.events];
                }
            }
        );
    }


}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {NotificationModel} from '../../models/notification.model';
import {NotificationsService} from './notifications.service';
import {MatDialogRef} from '@angular/material';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {

    listeNotification: NotificationModel[];
    subscription: Subscription;

    constructor(private notificationService: NotificationsService,
                public dialogRef: MatDialogRef<NotificationComponent>) {
    }

    ngOnInit() {
        this.subscription = this.notificationService.listeNotifications$.subscribe(
            notifications => this.listeNotification = notifications
        );
    }

    onQuit() {
        this.dialogRef.close();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }


}

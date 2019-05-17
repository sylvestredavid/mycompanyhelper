import {Injectable} from '@angular/core';
import {NotificationModel} from '../../models/notification.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {UsersService} from '../../users/users.service';
import {RequeteUtils} from '../../shared/utils/requete.utils';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {

    private listeNotifications: NotificationModel[];

    listeNotifications$: BehaviorSubject<NotificationModel[]> = new BehaviorSubject(this.listeNotifications);

    constructor(private http: HttpClient, private userService: UsersService, private requeteUtils: RequeteUtils) {
    }

    private getNotifications(): Observable<NotificationModel[]> {
        return this.http.get<NotificationModel[]>(this.requeteUtils.url + 'notifications?idUser=' + this.userService.idUser,
            this.requeteUtils.getOptions());
    }

    publishNotifications() {
        this.getNotifications().subscribe(
            notifications => {
                this.listeNotifications = notifications;
                this.listeNotifications$.next(this.listeNotifications);
            }
        );
    }

    saveNotification(notification: NotificationModel) {
        this.http.post<NotificationModel>(this.requeteUtils.url + 'notifications/save', notification, this.requeteUtils.getOptions())
            .subscribe(
            notification => {
                this.listeNotifications.splice(0, 0, notification);
                this.listeNotifications$.next(this.listeNotifications);
            }
        );
    }

    mettreVue(idProduit: number) {
        this.http.post(this.requeteUtils.url + 'notifications/mettreVue?idProduit=' + idProduit, '', this.requeteUtils.getOptions())
            .subscribe(
            () => {
                const index = this.listeNotifications.findIndex(notification => {
                    if (notification.idProduit === idProduit) {
                        return true;
                    }
                });
                this.listeNotifications[index].vue = true;
                this.listeNotifications$.next(this.listeNotifications);
            }
        );
    }
}

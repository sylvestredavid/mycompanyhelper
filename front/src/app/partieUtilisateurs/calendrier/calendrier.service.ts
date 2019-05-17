import {Injectable} from '@angular/core';
import {CalendrierModel} from '../../models/calendrier.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {UsersService} from '../../users/users.service';
import {RequeteUtils} from '../../shared/utils/requete.utils';

@Injectable({
  providedIn: 'root'
})
export class CalendrierService {

  private calendrierListe: CalendrierModel[];

  calendrierListe$: BehaviorSubject<CalendrierModel[]> = new BehaviorSubject(this.calendrierListe);

  constructor(private http: HttpClient, private userService: UsersService, private requeteUtils: RequeteUtils) { }

  private getCalendrier(): Observable<CalendrierModel[]> {
    return this.http.get<CalendrierModel[]>(this.requeteUtils.url + 'calendrier?idUser=' + this.userService.idUser, this.requeteUtils.getOptions());
  }

  publishCalendrier(){
    this.getCalendrier().subscribe(
        calendriers => {
          this.calendrierListe = calendriers;
          this.calendrierListe$.next(this.calendrierListe);
        }
    )
  }

  saveCalendrier(calendrier: CalendrierModel) {
    return this.http.post<CalendrierModel>(this.requeteUtils.url + 'calendrier/save', calendrier, this.requeteUtils.getOptions());
  }

  modifCalendrier(calendrier: CalendrierModel) {
    return this.http.post<CalendrierModel>(this.requeteUtils.url + 'calendrier/save', calendrier, this.requeteUtils.getOptions());
  }

  deleteCalendrier(id: number) {
    const url = this.requeteUtils.url + 'calendrier/delete?id=' + id;
    return this.http.delete(url, this.requeteUtils.getOptions());
  }

  pushCalendrier(c: CalendrierModel) {
    let dejaExistant = false;
    this.calendrierListe.forEach(
        cal => {
          if (cal.id === c.id) {
            dejaExistant = true;
            return;
          }
        }
    );
    if (!dejaExistant) {
      this.calendrierListe.push(c);
      this.calendrierListe$.next(this.calendrierListe);
    }
  }

  updateCalendrier(c: CalendrierModel) {
    const i = this.calendrierListe.findIndex(
        cal => {
          if (cal.id === c.id) {
            return true;
          }
        }
    );
    this.calendrierListe[i] = c;
    this.calendrierListe$.next(this.calendrierListe);
  }

  removeCalendrier(id: number) {
    const i = this.calendrierListe.findIndex(
        cal => {
          if (cal.id === id) {
            return true;
          }
        }
    );
    this.calendrierListe.splice(i, 1);
    this.calendrierListe$.next(this.calendrierListe);
  }
}

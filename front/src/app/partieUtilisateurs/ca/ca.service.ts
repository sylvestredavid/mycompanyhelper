import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {CAModel} from '../../models/ca.model';
import {HttpClient} from '@angular/common/http';
import {UsersService} from '../../users/users.service';
import {RequeteUtils} from '../../shared/utils/requete.utils';
import {CaPrevisionnelModel} from '../../models/caPrevisionnel.model';

@Injectable({
  providedIn: 'root'
})
export class CaService {

  private listeCAPrevisionnel: CaPrevisionnelModel[];

  listeCAPrevisionnel$ = new BehaviorSubject<CaPrevisionnelModel[]>(this.listeCAPrevisionnel);

  constructor(private http: HttpClient, private userService: UsersService, private requeteUtils: RequeteUtils) {
  }

  getCA(): Observable<CAModel[]> {
    return this.http.get<CAModel[]>(this.requeteUtils.url + 'ca?idUser=' + this.userService.idUser, this.requeteUtils.getOptions());
  }

  getCAPrevisionnel(): Observable<CaPrevisionnelModel[]> {
    return this.http.get<CaPrevisionnelModel[]>(this.requeteUtils.url + 'caPrevisionnel?idUser=' + this.userService.idUser, this.requeteUtils.getOptions());
  }

  publishCAPrevisionnel() {
    this.getCAPrevisionnel().subscribe(
        caPrevisionnel => {
          this.listeCAPrevisionnel = caPrevisionnel;
          this.listeCAPrevisionnel$.next(this.listeCAPrevisionnel);
        }
    );
  }

  saveCAPrevisionnel(caPrevisionnel: CaPrevisionnelModel) {
    return this.http.post<CaPrevisionnelModel>(this.requeteUtils.url + 'caPrevisionnel/save', caPrevisionnel, this.requeteUtils.getOptions());
  }

  pushCAPrevisionnel(newCAPrevisionnel) {
    let dejaExistant = false;
    this.listeCAPrevisionnel.forEach(
        caPrevisionnel => {
          if (caPrevisionnel.id === newCAPrevisionnel.id) {
            dejaExistant = true;
            return;
          }
        }
    );
    if (!dejaExistant) {
      this.listeCAPrevisionnel.push(newCAPrevisionnel);
      this.listeCAPrevisionnel$.next(this.listeCAPrevisionnel);
    }
  }

  replaceCAPrevisionnel(caPrevisionnel) {
    const index = this.listeCAPrevisionnel.findIndex(ca => {
      if (ca.id === caPrevisionnel.id) {
        return true;
      }
    });
    this.listeCAPrevisionnel[index] = caPrevisionnel;
    this.listeCAPrevisionnel$.next(this.listeCAPrevisionnel);
  }
}

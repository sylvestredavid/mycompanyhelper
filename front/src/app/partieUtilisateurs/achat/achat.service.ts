import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {UsersService} from "../../users/users.service";
import {RequeteUtils} from "../../shared/utils/requete.utils";
import {AchatModel} from "../../models/achat.model";

@Injectable({
  providedIn: 'root'
})
export class AchatService {

  private listeAchats: AchatModel[];

  listeAchats$: BehaviorSubject<AchatModel[]> = new BehaviorSubject(this.listeAchats);

  constructor(private http: HttpClient, private userService: UsersService, private requeteUtils: RequeteUtils) {
  }

  private getAchats(): Observable<AchatModel[]> {
    return this.http.get<AchatModel[]>(this.requeteUtils.url + 'achats?idUser=' + this.userService.idUser,
        this.requeteUtils.getOptions());
  }

  publishAchats() {
    this.getAchats().subscribe(
        achats => {
          this.listeAchats = achats;
          this.listeAchats$.next(this.listeAchats);
        }
    );
  }

  deleteAchat(id: number) {
    const url = this.requeteUtils.url + 'achats/delete?id=' + id;
    return this.http.delete(url, this.requeteUtils.getOptions());
  }

  saveAchat(achat: AchatModel) {
    return this.http.post<AchatModel>(this.requeteUtils.url + 'achats/save', achat, this.requeteUtils.getOptions());
  }

  pushAchat(newAchat: AchatModel) {
    let dejaExistant = false;
    this.listeAchats.forEach(
        achat => {
          if (achat.id === newAchat.id) {
            dejaExistant = true;
            return;
          }
        }
    );
    if (!dejaExistant) {
      this.listeAchats.push(newAchat);
      this.listeAchats$.next(this.listeAchats);
    }
  }

  replaceAchat(newAchat: AchatModel) {
    const index = this.listeAchats.findIndex(achats => {
      if (achats.id === newAchat.id) {
        return true;
      }
    });
    this.listeAchats[index] = newAchat;
    this.listeAchats$.next(this.listeAchats);
  }

  removeAchat(id: number) {
    const index = this.listeAchats.findIndex(achat => {
      if (achat.id === id) {
        return true;
      }
    });
    this.listeAchats.splice(index, 1);
    this.listeAchats$.next(this.listeAchats);
  }
}

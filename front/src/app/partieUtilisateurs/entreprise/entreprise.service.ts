import { Injectable } from '@angular/core';
import {OptionModel} from "../../models/option.model";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {UsersService} from "../../users/users.service";
import {RequeteUtils} from "../../shared/utils/requete.utils";
import {EntrepriseModel} from "../../models/entreprise.model";

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {

  private entreprise: EntrepriseModel;

  entreprise$ = new BehaviorSubject<EntrepriseModel>(this.entreprise);

  constructor(private http: HttpClient, private userService: UsersService, private requeteUtils: RequeteUtils) {
  }

  private getEntreprise(): Observable<EntrepriseModel> {
    return this.http.get<EntrepriseModel>(this.requeteUtils.url + 'entreprise?idUser=' + this.userService.idUser,
        this.requeteUtils.getOptions());
  }

  publishEntreprise() {
    this.getEntreprise().subscribe(
        entreprise => {
          this.entreprise = entreprise;
          this.entreprise$.next(this.entreprise);
        }
    );
  }

  saveEntreprise(entreprise: EntrepriseModel): Observable<EntrepriseModel> {
    return this.http.post<EntrepriseModel>(this.requeteUtils.url + 'entreprise/save', entreprise, this.requeteUtils.getOptions());
  }
}

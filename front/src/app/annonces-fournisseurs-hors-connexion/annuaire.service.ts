import {Injectable} from '@angular/core';
import {AnnonceModel} from '../models/annonce.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {EmailModel} from '../models/email.model';
import {RequeteUtils} from '../shared/utils/requete.utils';

@Injectable({
    providedIn: 'root'
})
export class AnnuaireService {

    private listeAnnonces: AnnonceModel[];

    listeAnnonces$ = new BehaviorSubject<AnnonceModel[]>(this.listeAnnonces);

    constructor(private http: HttpClient, private requeteUtils: RequeteUtils) {
    }

    private getAnnonces(): Observable<AnnonceModel[]> {
        return this.http.get<AnnonceModel[]>(this.requeteUtils.url + 'annuaireFournisseur/annonces');
    }

    publishAnnonces() {
        this.getAnnonces().subscribe(
            annonces => {
                this.listeAnnonces = annonces;
                this.listeAnnonces$.next(this.listeAnnonces);
            }
        );
    }

    getAnnonce(id: number): Observable<AnnonceModel> {
        return this.http.get<AnnonceModel>(this.requeteUtils.url + 'annuaireFournisseur/annonces/' + id);
    }

    sendMail(mail: EmailModel) {
        return this.http.post(this.requeteUtils.url + 'annuaireFournisseur/sendMail', mail);
    }

    pushAnnonce(newAnnonce: AnnonceModel) {
        let dejaExistant = false;
        this.listeAnnonces.forEach(
            annonce => {
                if (annonce.id === newAnnonce.id) {
                    dejaExistant = true;
                    return;
                }
            }
        );
        if (!dejaExistant) {
            this.listeAnnonces.push(newAnnonce);
            this.listeAnnonces$.next(this.listeAnnonces);
        }
    }

    removeAnnonce(id: any) {
        const index = this.listeAnnonces.findIndex(annonce => {
            if (annonce.id === id) {
                return true;
            }
        });
        this.listeAnnonces.splice(index, 1);
        this.listeAnnonces$.next(this.listeAnnonces);
    }

    augmenterNbContacts(id: number) {
        return this.http.post(this.requeteUtils.url + 'annuaireFournisseur/annonces/augmenterNbContacts?id=' + id, '');
    }
}

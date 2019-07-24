import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FactureModel} from '../../models/facture.model';
import {Observable} from 'rxjs';
import {CAModel} from '../../models/ca.model';
import {UsersService} from '../../users/users.service';
import {RequeteUtils} from '../../shared/utils/requete.utils';

@Injectable({
    providedIn: 'root'
})
export class FactureService {

    constructor(private http: HttpClient, private userService: UsersService, private requeteUtils: RequeteUtils) {
    }

    findAllFactures(): Observable<FactureModel[]> {
        return this.http.get<FactureModel[]>(this.requeteUtils.url + 'factures/findByUser?idUser=' + this.userService.idUser, this.requeteUtils.getOptions());
    }

    saveFacture(facture: FactureModel): Observable<FactureModel> {
        return this.http.post<FactureModel>(this.requeteUtils.url + 'factures/save', facture, this.requeteUtils.getOptions());
    }

    saveProduitsFacture(quantite: number, idFacture: number, idProduit: number) {
        this.http.post(this.requeteUtils.url + 'factures/saveProduits?quantite=' + quantite + '&idProduit=' + idProduit + '&idFacture='
            + idFacture, '', this.requeteUtils.getOptions()).subscribe();
    }

    sendMail(idFacture: number) {
        this.http.post(this.requeteUtils.url + 'factures/sendMail?idFacture=' + idFacture, '', this.requeteUtils.getOptions())
            .subscribe();
    }

    sendMailStockBas(email: string, produit: string) {
        this.http.post(this.requeteUtils.url + 'produits/mailStockBas?email=' + email + '&produit=' + produit, '',
            this.requeteUtils.getOptions()).subscribe();
    }
}

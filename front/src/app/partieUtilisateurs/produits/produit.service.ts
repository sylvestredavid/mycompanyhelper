import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ProduitModel} from '../../models/produit.model';
import {UsersService} from '../../users/users.service';
import {RequeteUtils} from '../../shared/utils/requete.utils';

@Injectable({
    providedIn: 'root'
})
export class ProduitService {

    private listeProduits: ProduitModel[];

    listeProduits$: BehaviorSubject<ProduitModel[]> = new BehaviorSubject(this.listeProduits);

    constructor(private http: HttpClient, private userService: UsersService, private requeteUtils: RequeteUtils) {
    }

    private getProduits(): Observable<ProduitModel[]> {
        return this.http.get<ProduitModel[]>(this.requeteUtils.url + 'produits?idUser=' + this.userService.idUser,
            this.requeteUtils.getOptions());
    }

    publishProduits() {
        this.getProduits().subscribe(
            produits => {
                this.listeProduits = produits;
                this.listeProduits$.next(this.listeProduits);
            }
        );
    }

    getProduit(id: number): Observable<ProduitModel> {
        return this.http.get<ProduitModel>(this.requeteUtils.url + 'produits/' + id, this.requeteUtils.getOptions());
    }

    deleteProduit(id: number) {
        const url = this.requeteUtils.url + 'produits/delete?id=' + id;
        return this.http.delete(url, this.requeteUtils.getOptions());
    }

    diminuerQte(quantite: number, id: number) {
        const url = this.requeteUtils.url + 'produits/diminuer?id=' + id + '&quantite=' + quantite;
        this.http.post(url, {}, this.requeteUtils.getOptions()).subscribe(
            () => {
                const index = this.listeProduits.findIndex(produits => {
                    if (produits.idProduit === id) {
                        return true;
                    }
                });
                this.listeProduits[index].quantite -= quantite;
                this.listeProduits$.next(this.listeProduits);
            }
        );
    }

    saveProduit(produit: ProduitModel) {
        return this.http.post<ProduitModel>(this.requeteUtils.url + 'produits/save', produit, this.requeteUtils.getOptions());
    }

    modifProduit(produit: ProduitModel) {
        return this.http.post<ProduitModel>(this.requeteUtils.url + 'produits/save', produit, this.requeteUtils.getOptions());
    }

    idGenreNull(idGenre: number) {
        this.http.post(this.requeteUtils.url + 'produits/idGenreNull?idGenre=' + idGenre, {},).subscribe(
            () => {
                this.listeProduits.forEach(produit => {
                    if (produit.genre.idGenre === idGenre) {
                        produit.genre = null;
                    }
                });
                this.listeProduits$.next(this.listeProduits);
            }
        );
    }

    marge(prixVente: number, prixAchat: number): number {
        if (prixVente === 0 && prixAchat === 0) {
            return 0;
        }
        const marge = ((prixVente - prixAchat) / prixAchat) * 100;
        return Math.round(marge * 10) / 10;
    }

    ajoutFacture(quantite: number, idFacture: number, idProduit: number) {
        this.listeProduits.forEach(produit => {
            if (produit.idProduit === idProduit) {
                produit.factures.push({quantite: quantite});
            }
        });
        this.listeProduits$.next(this.listeProduits);
    }

    remettreEnVente(id: number) {
        return this.http.post(this.requeteUtils.url + 'produits/remettreEnVente?id=' + id, '', this.requeteUtils.getOptions());
    }

    pushProduit(newProduit: ProduitModel) {
        let dejaExistant = false;
        this.listeProduits.forEach(
            produit => {
                if (produit.idProduit === newProduit.idProduit) {
                    dejaExistant = true;
                    return;
                }
            }
        );
        if (!dejaExistant) {
            this.listeProduits.push(newProduit);
            this.listeProduits$.next(this.listeProduits);
        }
    }

    replaceProduit(newProduit: ProduitModel) {
        const index = this.listeProduits.findIndex(produits => {
            if (produits.idProduit === newProduit.idProduit) {
                return true;
            }
        });
        this.listeProduits[index] = newProduit;
        this.listeProduits$.next(this.listeProduits);
    }

    removeProduit(id: number) {
        const index = this.listeProduits.findIndex(produits => {
            if (produits.idProduit === id) {
                return true;
            }
        });
        this.listeProduits[index].enVente = false;
        this.listeProduits$.next(this.listeProduits);
    }

    remiseEnVente(id: number) {
        const index = this.listeProduits.findIndex(produits => {
            if (produits.idProduit === id) {
                return true;
            }
        });
        this.listeProduits[index].enVente = true;
        this.listeProduits$.next(this.listeProduits);
    }
}

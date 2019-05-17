import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {FournisseurModel} from '../../models/fournisseur.model';
import {UsersService} from '../../users/users.service';
import {RequeteUtils} from '../../shared/utils/requete.utils';

@Injectable({
    providedIn: 'root'
})
export class FournisseursService {

    private listeFournisseurs: FournisseurModel[];

    listeFournisseurs$: BehaviorSubject<FournisseurModel[]> = new BehaviorSubject(this.listeFournisseurs);

    constructor(private http: HttpClient, private userService: UsersService, private requeteUtils: RequeteUtils) {
    }


    private getFournisseurs(): Observable<FournisseurModel[]> {
        return this.http.get<FournisseurModel[]>(this.requeteUtils.url + 'fournisseurs?idUser=' + this.userService.idUser,
            this.requeteUtils.getOptions());
    }

    publishFournisseurs() {
        this.getFournisseurs().subscribe(
            fournisseurs => {
                this.listeFournisseurs = fournisseurs;
                this.listeFournisseurs$.next(this.listeFournisseurs);
            }
        );
    }

    getFournisseur(id: number): Observable<FournisseurModel> {
        return this.http.get<FournisseurModel>(this.requeteUtils.url + 'fournisseurs/' + id, this.requeteUtils.getOptions());
    }

    modifFournisseur(fournisseur: FournisseurModel) {
        return this.http.post<FournisseurModel>(this.requeteUtils.url + 'fournisseurs/save', fournisseur, this.requeteUtils.getOptions());
    }

    saveFournisseur(fournisseur: FournisseurModel) {
        return this.http.post<FournisseurModel>(this.requeteUtils.url + 'fournisseurs/save', fournisseur, this.requeteUtils.getOptions());
    }

    deleteFournisseur(id: number) {
        return this.http.delete(this.requeteUtils.url + 'fournisseurs/delete?id=' + id, this.requeteUtils.getOptions());

    }

    pushFournisseur(newFfournisseur: any) {
        let dejaExistant = false;
        this.listeFournisseurs.forEach(
            fournisseur => {
                if (fournisseur.idFournisseur === newFfournisseur.idFournisseur) {
                    dejaExistant = true;
                    return;
                }
            }
        );
        if (!dejaExistant) {
            this.listeFournisseurs.push(newFfournisseur);
            this.listeFournisseurs$.next(this.listeFournisseurs);
        }
    }

    replaceFournisseur(fournisseur: any) {
        const index = this.listeFournisseurs.findIndex(fournisseurs => {
            if (fournisseurs.idFournisseur === fournisseur.idFournisseur) {
                return true;
            }
        });
        this.listeFournisseurs[index] = fournisseur;
        this.listeFournisseurs$.next(this.listeFournisseurs);
    }

    removeFournisseur(id: any) {
        const index = this.listeFournisseurs.findIndex(fournisseur => {
            if (fournisseur.idFournisseur === id) {
                return true;
            }
        });
        this.listeFournisseurs.splice(index, 1);
        this.listeFournisseurs$.next(this.listeFournisseurs);
    }
}

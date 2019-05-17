import {Injectable} from '@angular/core';
import {AnnonceModel} from '../../models/annonce.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {UsersService} from '../../users/users.service';
import {RequeteUtils} from '../../shared/utils/requete.utils';

@Injectable({
    providedIn: 'root'
})
export class AnnonceService {

    private listeAnnonces: AnnonceModel[];

    listeAnnonces$ = new BehaviorSubject<AnnonceModel[]>(this.listeAnnonces);

    constructor(private http: HttpClient, private userService: UsersService, private requeteUtils: RequeteUtils) {
    }

    private getAnnones(): Observable<AnnonceModel[]> {
        return this.http.get<AnnonceModel[]>
        (this.requeteUtils.url + 'annuaireFournisseur/' + this.userService.idUser + '/annonces', this.requeteUtils.getOptions());
    }

    publishAnnonces() {
        this.getAnnones().subscribe(
            annonces => {
                this.listeAnnonces = annonces;
                this.listeAnnonces$.next(this.listeAnnonces);
            }
        );
    }

    getAnnonce(id: number): Observable<AnnonceModel> {
        return this.http.get<AnnonceModel>(this.requeteUtils.url + 'annuaireFournisseur/annonces/' + id, this.requeteUtils.getOptions());
    }

    saveAnnonce(annonce: AnnonceModel) {
        return this.http.post<AnnonceModel>(this.requeteUtils.url + 'annuaireFournisseur/annonces/save', annonce,
            this.requeteUtils.getOptions());
    }

    updateAnnonce(annonce: AnnonceModel) {
        this.http.post<AnnonceModel>(this.requeteUtils.url + 'annuaireFournisseur/annonces/save', annonce,
            this.requeteUtils.getOptions()).subscribe(
            newAnnonce => {
                const index = this.listeAnnonces.findIndex(annonce => {
                    if (annonce.id === newAnnonce.id) {
                        return true;
                    }
                });
                this.listeAnnonces[index] = newAnnonce;
                this.listeAnnonces$.next(this.listeAnnonces);
            }
        );
    }

    sendFile(file: File) {
        const data: FormData = new FormData();
        data.append(`data`, file, file.name);
        return this.http.post(this.requeteUtils.url + 'annuaireFournisseur/files/upload', data);
    }

    getFile(filename: string): Observable<string> {
        return this.http.get<string>(this.requeteUtils.url + 'annuaireFournisseur/files/' + filename);
    }

    deleteFile(filename: string) {
        this.http.delete(this.requeteUtils.url + 'annuaireFournisseur/files/delete?nom=' + filename).subscribe();
    }

    delete(id: number) {
        const url = this.requeteUtils.url + 'annuaireFournisseur/annonces/delete?id=' + id;
        this.http.delete(url, this.requeteUtils.getOptions()).subscribe(
            () => {
                const index = this.listeAnnonces.findIndex(annonce => {
                    if (annonce.id === id) {
                        return true;
                    }
                });
                this.listeAnnonces.splice(index, 1);
                this.listeAnnonces$.next(this.listeAnnonces);
            }
        );
    }

    miseEnAvant(token: string, idAnnonce: number) {
        return this.http.post(this.requeteUtils.url + 'annuaireFournisseur/miseEnAvant?token=' + token + '&idAnnonce=' + idAnnonce, '');
    }

    mettreAnnonceEnAvant(idAnnonce: number) {
        const index = this.listeAnnonces.findIndex(annonce =>{
            if (annonce.id === idAnnonce) {
                return true;
            }
        });
        this.listeAnnonces[index].misEnAvant = true;
        this.listeAnnonces$.next(this.listeAnnonces);
    }

    pushAnnonce(newAnnonce: AnnonceModel) {
        this.listeAnnonces.push(newAnnonce);
        this.listeAnnonces$.next(this.listeAnnonces);
    }
}

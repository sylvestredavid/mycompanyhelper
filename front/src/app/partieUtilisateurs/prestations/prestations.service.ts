import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {UsersService} from '../../users/users.service';
import {RequeteUtils} from '../../shared/utils/requete.utils';
import {PrestationModel} from '../../models/prestation.model';

@Injectable({
    providedIn: 'root'
})
export class PrestationsService {

    private listePrestations: PrestationModel[];

    listePrestations$: BehaviorSubject<PrestationModel[]> = new BehaviorSubject(this.listePrestations);

    constructor(private http: HttpClient, private userService: UsersService, private requeteUtils: RequeteUtils) {
    }


    private getPrestations(): Observable<PrestationModel[]> {
        return this.http.get<PrestationModel[]>(this.requeteUtils.url + 'prestations?idUser=' + this.userService.idUser,
            this.requeteUtils.getOptions());
    }

    publishPrestations() {
        this.getPrestations().subscribe(
            prestations => {
                this.listePrestations = prestations;
                this.listePrestations$.next(this.listePrestations);
            }
        );
    }

    modifPrestation(prestation: PrestationModel) {
        return this.http.post<PrestationModel>(this.requeteUtils.url + 'prestations/save', prestation, this.requeteUtils.getOptions());
    }

    savePrestation(prestation: PrestationModel) {
        return this.http.post<PrestationModel>(this.requeteUtils.url + 'prestations/save', prestation, this.requeteUtils.getOptions());
    }

    deletePrestation(id: number) {
        return this.http.delete(this.requeteUtils.url + 'prestations/delete?id=' + id, this.requeteUtils.getOptions());

    }

    pushPrestation(newPrestation: PrestationModel) {
        let dejaExistant = false;
        this.listePrestations.forEach(
            p => {
                if (p.id === newPrestation.id) {
                    dejaExistant = true;
                    return;
                }
            }
        );
        if (!dejaExistant) {
            this.listePrestations.push(newPrestation);
            this.listePrestations$.next(this.listePrestations);
        }
    }

    replacePrestation(prestation: PrestationModel) {
        const index = this.listePrestations.findIndex(p => {
            if (p.id === prestation.id) {
                return true;
            }
        });
        this.listePrestations[index] = prestation;
        this.listePrestations$.next(this.listePrestations);
    }

    removePrestation(id: any) {
        const index = this.listePrestations.findIndex(p => {
            if (p.id === id) {
                return true;
            }
        });
        this.listePrestations.splice(index, 1);
        this.listePrestations$.next(this.listePrestations);
    }
}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserModel} from '../models/user.modele';
import {LoginModel} from '../models/Login.model';
import {SignUpModel} from '../models/signUp.model';
import {RequeteUtils} from '../shared/utils/requete.utils';

@Injectable({
    providedIn: 'root'
})
export class UsersService {

    idUser: number;

    constructor(private http: HttpClient, private requeteUtils: RequeteUtils) {
    }

    findAllUsername(): Observable<string[]> {
        return this.http.get<string[]>(this.requeteUtils.url + 'users/findAllUsername');
    }

    signin(login: LoginModel): Observable<UserModel> {
        return this.http.post<UserModel>(this.requeteUtils.url + 'users/signin', login);
    }

    dejaConntecte(token: string): Observable<UserModel> {
        return this.http.post<UserModel>(this.requeteUtils.url + 'users/dejaConnecte?token=' + token, '');
    }

    signup(request: SignUpModel): Observable<UserModel> {
        return this.http.post<UserModel>(this.requeteUtils.url + 'users/signup', request);
    }

    findGestionnaires(managementId: number): Observable<UserModel[]> {
        return this.http.get<UserModel[]>(`${this.requeteUtils.url}users/${managementId}/gestionnaires`);
    }

    deleteGestionnaire(id: number) {
        this.http.delete<UserModel[]>(`${this.requeteUtils.url}users/gestionnaires/delete?id=${id}`).subscribe();
    }

    abonnement(token: string, email: string) {
        return this.http.post(`${this.requeteUtils.url}users/abonnement?token=${token}&email=${email}`, '');
    }

    abonnementRequete(token: string, email: string) {
        return this.http.post(`${this.requeteUtils.url}users/abonnementRequete?token=${token}&email=${email}`, '');
    }

    addAbonnement(idSubscription: string, email: string) {
        this.http.post(`${this.requeteUtils.url}users/addAbonnement?idSubscription=${idSubscription}&email=${email}`, '').subscribe();
    }

    changePassword(password: string, email: string) {
        const body: LoginModel = {
            username: email,
            password: password
        };
        const url = `${this.requeteUtils.url}users/changePassword`;
        return this.http.post(url, body);
    }

    mailPassword(mail: string, lien: string) {
        return this.http.post(`${this.requeteUtils.url}users/mailPassword?mail=${mail}&lien=${lien}`, '');
    }

    abonnementFournisseur(token: string, email: string) {
        return this.http.post(`${this.requeteUtils.url}users/abonnementFournisseur?token=${token}&email=${email}`, '');
    }
}

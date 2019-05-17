import {Injectable, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {UserState} from '../stores/user.reducer';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

@Injectable()
export class FournisseurGuard implements CanActivate {

    role: string;

    constructor(@Inject(LOCAL_STORAGE) private localStorage: any, private router: Router, private store: Store<UserState>) {
        this.store.select('user').subscribe(
            users => {
                if (users) {
                    this.role = users[0].authorities;
                }
            }
        );
    }


    /**
     * redirige vers la page de connexion fournisseur  si on est pas fournisseur
     * @param route la route active
     * @param state l'etat de la route
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (sessionStorage.getItem('token') !== null && this.role === 'ROLE_FOURNISSEUR') {
            return true;
        } else if (this.localStorage.getItem('token') !== null && this.role === 'ROLE_FOURNISSEUR') {
            return true;
        } else {
            this.router.navigate(['']);
        }
    }
}

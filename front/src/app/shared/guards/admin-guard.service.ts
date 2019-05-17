import {Injectable, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {UserState} from '../stores/user.reducer';
import {AjoutUser} from '../stores/user.actions';
import {UsersService} from '../../users/users.service';
import {GetOptions} from '../stores/options.actions';
import {OptionsService} from '../../partieUtilisateurs/options/options.service';
import {ProduitService} from '../../partieUtilisateurs/produits/produit.service';
import {ClientsService} from '../../partieUtilisateurs/clients/clients.service';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

@Injectable()
export class AdminGuard implements CanActivate {

    role: string;

    constructor(@Inject(LOCAL_STORAGE) private localStorage: any, private router: Router, private store: Store<UserState>, private userService: UsersService,
                private optionService: OptionsService, private produitService: ProduitService, private clientService: ClientsService) {
        this.store.select('user').subscribe(
            users => {
                if (users) {
                    this.role = users[0].authorities;
                }
            }
        );
    }

    /**
     * redirige vers le dashboard si on est pas admin
     * @param route la route active
     * @param state l'etat de la route
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (sessionStorage.getItem('token') !== null) { // si token dans sessionStorage
            return this.marcheASuivre('sessionStorage');
        } else if (this.localStorage.getItem('token') !== null) { // si token dans sessionStorage
            return this.marcheASuivre('localStorage');
        } else { // sinon on envoi vers la page de connexion
            this.router.navigate(['connexion']);
        }
    }

    private marcheASuivre(storage: string) {
        if (this.role) { // si un user est présent dans le store
            if (this.role === 'ROLE_ADMIN') { // si c'est un admin il peut aller a la page demandé
                return true;
            } else if (this.role === 'ROLE_FOURNISSEUR') { // si le role est different de fournisseur on stock l'user dans le store
                this.router.navigate(['fournisseurs']);
            } else { // sinon on lui indique qu'il n'est pas sur la bonne page de connexion
                this.router.navigate(['users']);
            }
        } else { // si aucun user dans le store on le recupere dans la bdd a l'aide du token et on le met dans le store et on le redirige vers le dashboard
            const token = storage === 'sessionStorage' ? sessionStorage.getItem('token') : this.localStorage.getItem('token');
            this.userService.dejaConntecte(token).subscribe(
                user => {
                    this.store.dispatch(new AjoutUser(user));
                    this.userService.idUser = user.managementId !== null ? user.managementId : user.id;
                    if (user.authorities !== 'ROLE_FOURNISSEUR') { // si le role est different de fournisseur on stock l'user dans le store
                        this.router.navigate(['users']);
                    } else { // sinon on lui indique qu'il n'est pas sur la bonne page de connexion
                        this.router.navigate(['fournisseurs']);
                    }
                }
            );
        }
    }
}

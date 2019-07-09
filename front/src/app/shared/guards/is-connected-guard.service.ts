import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {UserState} from '../stores/user.reducer';
import {AjoutUser} from '../stores/user.actions';
import {UsersService} from '../../users/users.service';
import {OptionsService} from '../../partieUtilisateurs/options/options.service';
import {ProduitService} from '../../partieUtilisateurs/produits/produit.service';
import {ClientsService} from '../../partieUtilisateurs/clients/clients.service';


@Injectable()
export class IsConnectedGuard implements CanActivate {

    role: string;

    constructor(private router: Router, private userService: UsersService, private store: Store<UserState>,
                private optionService: OptionsService, private produitService: ProduitService, private clientService: ClientsService) {
    }

    /**
     * Vérifie si le token est présent dans le sessionStorage ou le localStorage (donc connexion déjà faite) dans ce cas on récupère l'user
     * dans le back et on le sotck dans le store, idem pour les options et l'user est directement redirigé vers le dashboard sans avoir
     * besoin de s'identifier à nouveau.
     * dans le cas contraire on le dirige vers la page de connexion
     * @param route la route active
     * @param state l'etat de la route
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (sessionStorage.getItem('token') !== null || localStorage.getItem('token') !== null) {
            const token = sessionStorage.getItem('token') || localStorage.getItem('token');
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
        } else {
            return true;
        }
    }
}

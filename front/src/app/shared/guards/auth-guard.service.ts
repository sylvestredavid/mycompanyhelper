import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable, Inject} from '@angular/core';
import {UserModel} from '../../models/user.modele';
import {UserState} from '../stores/user.reducer';
import {Store} from '@ngrx/store';
import {AjoutUser} from '../stores/user.actions';
import {UsersService} from '../../users/users.service';
import {GetOptions} from '../stores/options.actions';
import {OptionsService} from '../../partieUtilisateurs/options/options.service';
import {ProduitService} from '../../partieUtilisateurs/produits/produit.service';
import {ClientsService} from '../../partieUtilisateurs/clients/clients.service';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

@Injectable()
export class AuthGuard implements CanActivate {

  user: UserModel;

  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, private router: Router, private store: Store<UserState>, private userService: UsersService,
              private optionService: OptionsService, private produitService: ProduitService, private clientService: ClientsService) {
    this.store.select('user').subscribe(
        users => {
          if (users) {
            this.user = users[0];
          }
        }
    );
  }


  /**
   * redirige vers la page de connexion si pas connecté
   * @param route la route active
   * @param state l'etat de la route
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (sessionStorage.getItem('token') !== null || this.localStorage.getItem('token') !== null) { // si token présent dans un des storage
      if (this.user) { // si user présent dans le store
        return true; // la voie est libre
      } else { // si user pas dans le store mais token présent dans un des storage on appel le back, stock l'user et ses options
                // dans les stores et le dirige vers le dashboard
        const token = sessionStorage.getItem('token') || this.localStorage.getItem('token')
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
    } else { // si pas de token on le redirige vers la page de connexion
      this.router.navigate(['connexion']);
    }
  }
}

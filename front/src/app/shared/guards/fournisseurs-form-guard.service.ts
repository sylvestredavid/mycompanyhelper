import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material';
import {DialogGuardComponent} from './dialog-guard/dialog-guard.component';
import {FournisseursListeComponent} from '../../partieUtilisateurs/fournisseurs/fournisseurs-liste/fournisseurs-liste.component';

/**
 * la methode canDeactivate est appelée quand on quitte la page FournisseursListeComponent
 * elle verifie si des formulaires ont été modifié sans etre enregistré, dans ce cas, elle ouvre une boite de dialog demandant
 * si l'utilisateur veux les enregistré ou pas
 */
@Injectable()
export class FournisseursFormGuard implements CanDeactivate<FournisseursListeComponent> {

    isDistry: boolean;

    constructor(public dialog: MatDialog) {
        this.isDistry = false;
    }

    canDeactivate(
        component: FournisseursListeComponent,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {

        for (let i = 0; i < component.elements.length; i++) {
            if (component.elements.controls[i].dirty) {
                this.isDistry = true;
            }
        }
        if (this.isDistry) {
            this.openDialog(component);
            this.isDistry = false;
        }
        return true;

    }

    openDialog(component: FournisseursListeComponent) {
        const dialogRef = this.dialog.open(DialogGuardComponent, {
            width: '250px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result === 'oui') {
                    component.envoiForm();
                }
            }
        });
    }
}

import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ProduitsComponent} from '../../partieUtilisateurs/produits/listes-produits/produits.component';
import {MatDialog} from '@angular/material';
import {DialogGuardComponent} from './dialog-guard/dialog-guard.component';

/**
 * la methode canDeactivate est appelée quand on quitte la page ProduitsComponent
 * elle verifie si des formulaires ont été modifié sans etre enregistré, dans ce cas, elle ouvre une boite de dialog demandant
 * si l'utilisateur veux les enregistré ou pas
 */
@Injectable()
export class ProduitsFormGuard implements CanDeactivate<ProduitsComponent> {

    isDistry: boolean;

    constructor(public dialog: MatDialog) {
        this.isDistry = false;
    }

    canDeactivate(
        component: ProduitsComponent,
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

    openDialog(component: ProduitsComponent) {
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

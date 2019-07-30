import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {UserState} from "../../shared/stores/user.reducer";
import {ProduitService} from "../produits/produit.service";

@Component({
    selector: 'app-ajout-genre',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
    private role: string;

    constructor(private store: Store<UserState>, private produitService: ProduitService) {
    }

    ngOnInit() {
        this.produitService.publishProduits();
        this.store.select('user').subscribe(
            user => {
                if (user) {
                    this.role = user[0].authorities;
                }
            }
        );

    }

    ngOnDestroy(): void {
    }

}

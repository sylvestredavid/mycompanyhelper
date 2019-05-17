import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProduitService} from '../produits/produit.service';
import {ProduitModel} from '../../models/produit.model';
import {ClientsService} from '../clients/clients.service';
import {ClientModel} from '../../models/client.model';
import {GenreModel} from '../../models/genre.model';
import {GenreService} from '../genres/genre.service';
import {OptionsService} from '../options/options.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

    listeProduits: ProduitModel[];
    listeClients: ClientModel[];
    listeGenres: GenreModel[];
    limiteClient: number;
    limiteStock: number;
    subscriptions: Subscription[] = [];

    constructor(private produitService: ProduitService, private clientService: ClientsService, private genreService: GenreService,
                private optionService: OptionsService) {

    }

    ngOnInit() {
        this.subscriptions.push(this.optionService.options$.subscribe(
            option => {
                if (option) {
                    this.limiteClient = option.limiteClients;
                    this.limiteStock = option.limiteStock;
                    this. subscriptions.push(this.produitService.listeProduits$.subscribe(
                        produits => {
                            if (produits) {
                                this.listeProduits = [];
                                produits.forEach(
                                    produit => {
                                        if (produit.enVente === true && produit.quantite <= this.limiteStock) {
                                            this.listeProduits.push(produit);
                                        }
                                    }
                                );
                            }
                        }
                    ));
                    this.subscriptions.push(this.clientService.listeClients$.subscribe(
                        clients => {
                            if (clients) {
                                this.listeClients = [];
                                clients.forEach(
                                    client => {
                                        if (client.factures.length >= this.limiteClient) {
                                            this.listeClients.push(client);
                                        }
                                    }
                                );
                            }
                        }
                    ));
                    this.subscriptions.push(this.genreService.listeGenre$.subscribe(
                        genres => this.listeGenres = genres
                    ));
                }

            }
        ));
    }

    ngOnDestroy(): void {
        if (this.subscriptions.length > 0) {
            this.subscriptions.forEach(subscription => subscription.unsubscribe());
        }
    }

}

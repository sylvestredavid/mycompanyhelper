import {Component, Input, OnInit} from '@angular/core';
import {CAModel} from '../../../models/ca.model';
import {CHIFFRE_AFFAIRE} from '../../../models/mockca';
import {DatePipe} from '@angular/common';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ProduitsFactureModel} from '../../../models/produitsFacture.model';
import {ProduitModel} from '../../../models/produit.model';
import {Store} from '@ngrx/store';
import {UserState} from '../../../shared/stores/user.reducer';
import {AchatService} from '../../achat/achat.service';
import {ClientsService} from '../../clients/clients.service';
import {CaService} from '../../ca/ca.service';
import {ProduitService} from "../../produits/produit.service";

@Component({
    selector: 'app-graphique-produits',
    templateUrl: './graphique-produits.component.html',
    styleUrls: ['./graphique-produits.component.scss'],
    animations: [
        trigger('slider', [
            state('initial', style({
                left: '0%',
            })),
            state('step1', style({
                left: '-100%',
            })),
            state('step2', style({
                left: '-200%',
            })),
            state('final', style({
                left: '-300%',
            })),
            transition('*<=>*', animate('1000ms')),
        ]),
    ]
})
export class GraphiqueProduitsComponent implements OnInit {

    @Input() listeProduits: ProduitModel[];
    ca: CAModel[];
    position = 'initial';
    produitDiag: any[] = [];
    role: string;

    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };
    margetDiag: any[] = [];

    constructor(private datePipe: DatePipe, iconRegistry: MatIconRegistry, private produitService: ProduitService,
                sanitizer: DomSanitizer, private storeUser: Store<UserState>, private clientService: ClientsService) {
        iconRegistry.addSvgIcon(
            'right',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/right.svg'));
        iconRegistry.addSvgIcon(
            'left',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/left.svg'));
        this.storeUser.select('user').subscribe(
            user => {
                if (user) {
                    this.role = user[0].authorities;
                }
            }
        );
    }

    ngOnInit() {
        this.initproduitData();
        this.initMargeDate();
    }

    /**
     * slider des graphiques
     * @param direction droite ou gauche
     */
    slider(direction: string) {
        if (this.role === 'ROLE_ADMIN') {
            if (direction === 'right') {
                if (this.position === 'initial') {
                    this.position = 'step1';
                }
            } else if (direction === 'left') {
                if (this.position === 'step1') {
                    this.position = 'initial';
                }
            }
        }
    }

    /**
     * initialisation des données du graphique des produits
     */
    private initproduitData() {
        this.listeProduits.forEach(produit => {
            this.produitDiag.push({name: produit.designation, value: this.nbVente(produit.factures)});
        });
    }

    /**
     * calcul le nombre de vente par prestation
     * @param factures les factures associées au prestation
     */
    private nbVente(factures: ProduitsFactureModel[]): number {
        let total = 0;
        factures.forEach(facture => {
            total += facture.quantite;
        });
        return total;
    }

    private initMargeDate() {
        this.listeProduits.forEach(produit => {
            this.margetDiag.push({name: produit.designation, value: this.produitService.marge(produit.prixVente, produit.prixAchat)});
        });
    }
}

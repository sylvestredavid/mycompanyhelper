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
import {FactureService} from '../../factures/facture.service';

@Component({
    selector: 'app-graphique',
    templateUrl: './graphique.component.html',
    styleUrls: ['./graphique.component.scss'],
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
export class GraphiqueComponent implements OnInit {

    @Input() listeProduits: ProduitModel[];
    ca: CAModel[];
    position = 'initial';
    annees: number[] = [];
    caDiag: any[];
    produitDiag: any[] = [];
    role: string;
    exemple = false;

    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    constructor(private datePipe: DatePipe, iconRegistry: MatIconRegistry, private factureService: FactureService,
                sanitizer: DomSanitizer, private storeUser: Store<UserState>) {
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
        this.initCA();
        this.initproduitData();
    }

    /**
     * recuperation du ca
     */
    initCA() {
        if (this.role === 'ROLE_ADMIN') {
            this.factureService.getCA().subscribe(
                ca => {
                    if (ca.length > 2) {
                        this.ca = ca;
                    } else {
                        this.ca = CHIFFRE_AFFAIRE;
                        this.exemple = true;
                    }
                    this.initAnnees();
                    this.initCaData();
                }
            );
        }
    }

    /**
     * initialisation des données du graphique du chiffre d'affaire
     */
    private initCaData() {
        this.caDiag = [];
        let series: any[] = [];
        this.annees.forEach(annee => {
            series = [];
            this.ca.forEach(ca => {
                if (ca.annee === annee) {
                    series.push({name: this.datePipe.transform(new Date(ca.annee, ca.mois), 'MM'), value: ca.chiffreDAffaire});
                }
            });
            this.caDiag.push({name: annee, series: series});
        });
    }

    /**
     * initialisation des années afin de creer les données du graphique du chiffre d'affaire
     */
    private initAnnees() {
        this.ca.forEach(ca => {
            if (!this.annees.includes(ca.annee)) {
                this.annees.push(ca.annee);
            }
        });
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
     * calcul le nombre de vente par produit
     * @param factures les factures associées au produit
     */
    private nbVente(factures: ProduitsFactureModel[]): number {
        let total = 0;
        factures.forEach(facture => {
            total += facture.quantite;
        });
        return total;
    }
}

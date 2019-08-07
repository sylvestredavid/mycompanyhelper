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

@Component({
    selector: 'app-graphique-ca',
    templateUrl: './graphique-ca.component.html',
    styleUrls: ['./graphique-ca.component.scss'],
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
export class GraphiqueCaComponent implements OnInit {

    ca: CAModel[];
    position = 'initial';
    annee: number;
    mois: string[];
    caDiag: any[];
    caPrevisionnelData: any[];
    role: string;
    exemple = false;

    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };
    pieData: any[];
    date: Date;

    constructor(private datePipe: DatePipe, iconRegistry: MatIconRegistry, private caService: CaService,
                sanitizer: DomSanitizer, private storeUser: Store<UserState>, private achatService: AchatService,
                private clientService: ClientsService) {
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
        this.annee = new Date().getFullYear();
        this.mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];
        this.date = new Date();
        this.initPieData();
        this.initCA();
    }

    /**
     * recuperation du ca
     */
    initCA() {
        if (this.role === 'ROLE_ADMIN') {
            this.caService.getCA().subscribe(
                ca => {
                    if (ca.length > 0) {
                        this.ca = ca;
                    } else {
                        this.ca = CHIFFRE_AFFAIRE;
                        this.exemple = true;
                    }
                    this.ca.sort(function(a, b) {
                        return a.mois - b.mois;
                    });
                    this.initCaData();
                    this.initCaPrevisionnelData();
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
            for (let i = 0; i < this.mois.length; i++) {
                series = [];
                this.ca.forEach(ca => {
                    if (ca.mois === i) {
                        series.push({name: ca.annee, value: ca.chiffreDAffaire});
                    }
                });
                this.caDiag.push({name: this.mois[i], series: series});
            }
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
                else if (this.position === 'step1') {
                    this.position = 'step2';
                }
            } else if (direction === 'left') {
                if (this.position === 'step1') {
                    this.position = 'initial';
                }
                else if (this.position === 'step2') {
                    this.position = 'step1';
                }
            }
        }
    }

    private initPieData() {
        let totalEntree = 0;
        let totalSorties = 0;

        this.achatService.listeAchats$.subscribe(
            achats => {
                achats.forEach(
                    a => {
                        const dateAchat = new Date(a.date);
                        if (dateAchat.getMonth() === this.date.getMonth() && dateAchat.getFullYear() === this.date.getFullYear()) {
                            totalSorties += a.total;
                        }
                    }
                );
                this.clientService.listeClients$.subscribe(
                    clients => {
                        clients.forEach(
                            c => {
                                c.factures.forEach(
                                    f => {
                                        const dateFacture = new Date(f.date);
                                        if (dateFacture.getMonth() === this.date.getMonth() && dateFacture.getFullYear() === this.date.getFullYear()) {
                                            totalEntree += f.totalTTC;
                                        }
                                    }
                                );
                            }
                        );
                        this.pieData = [
                            {
                                'name': 'Entrées',
                                'value': totalEntree
                            },
                            {
                                'name': 'Sorties',
                                'value': totalSorties
                            }
                        ];
                    }
                );
            }
        );
    }

    private initCaPrevisionnelData() {
        this.caService.listeCAPrevisionnel$.subscribe(
            caPrevisionel =>{
                caPrevisionel.sort(function(a, b) {
                    return a.mois - b.mois;
                });
                this.caPrevisionnelData = [];
                let seriesPrévisionnel: any[] = [];
                caPrevisionel.forEach(ca => {
                    seriesPrévisionnel.push({name: this.mois[ca.mois], value: ca.chiffreDAffaire});
                });
                this.caPrevisionnelData.push({name: 'prévisionnel', series: seriesPrévisionnel});

                let series: any[] = [];
                this.ca.forEach(ca => {
                    if (ca.annee === this.annee) {
                        series.push({name: this.mois[ca.mois], value: ca.chiffreDAffaire});
                    }
                });
                this.caPrevisionnelData.push({name: this.annee, series: series});
            }
        )

    }
}

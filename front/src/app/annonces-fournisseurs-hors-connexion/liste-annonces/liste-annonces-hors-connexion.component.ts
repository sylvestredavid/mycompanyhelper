import {Component, HostListener, OnDestroy, OnInit, Inject, AfterViewInit, Renderer2} from '@angular/core';
import {AnnonceModel} from '../../models/annonce.model';
import {AnnuaireService} from '../annuaire.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {SocketService} from '../../shared/socket.service';
import { Title }  from '@angular/platform-browser';

@Component({
    selector: 'app-liste-annonces-hors-connexion',
    templateUrl: './liste-annonces-hors-connexion.component.html',
    styleUrls: ['./liste-annonces-hors-connexion.component.scss']
})
export class ListeAnnoncesHorsConnexionComponent implements OnInit, OnDestroy {

    listeAnnonces: AnnonceModel[];
    annoncesAAfficher: AnnonceModel[];
    max: number;
    subscription: Subscription;
    screenWidth: number;
    constructor(private annuaireService: AnnuaireService, private fb: FormBuilder,
                private titleService: Title, private renderer2: Renderer2 ) {
    }

    ngOnInit() {
        this.getScreenSize()

        console.log(document.getElementById('33883-31'))
        this.titleService.setTitle( 'Annonces fournisseurs gratuites' );
        this.annuaireService.publishAnnonces();
        this.subscription = this.annuaireService.listeAnnonces$.subscribe(
            annonces => {
                this.listeAnnonces = annonces;
                this.annoncesAAfficher = this.listeAnnonces;
                this.max = this.getMax(annonces);
            }
        );
        // this.socket.getAjoutAnnonce().subscribe(
        //     annonce => this.annuaireService.pushAnnonce(annonce)
        // );
        // this.socket.getDeleteAnnonce().subscribe(
        //     annonce => this.annuaireService.removeAnnonce(annonce.id)
        // );
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenWidth = window.innerWidth;
        setTimeout(() =>{this.initScripts(); }, 500);
    }

    /**
     * fonction qui supprime les espaces, accents et virgules
     * @param entree la chaine de caractere de l'input
     * @return string la chaine de caractere formatée
     */
    private formate(entree: string): string {
        let result = entree.toLowerCase();
        result = result.replace(/[\s]/g, '');
        result = result.replace(/[,]/g, '');
        result = result.replace(/[éèëê]/g, 'e');
        result = result.replace(/[àầä]/g, 'a');
        result = result.replace(/[ôö]/g, 'o');
        result = result.replace(/[ùûü]/g, 'u');
        result = result.replace(/[îï]/g, 'i');
        if (result.charAt(result.length - 1).toLowerCase() === 's') {
            result = result.slice(0, result.length - 1);
        }
        return result;
    }

    /**
     * fonction qui parcoure la liste d'annonces pour resortir les annonces contenant le mot cherché
     * @param filterValue la chaine de caractere de l'input
     */
    filtrerParProduits(filterValue: string) {
        this.annoncesAAfficher = [];
        this.listeAnnonces.forEach(
            annonce => {
                if (this.formate(annonce.categories).includes(this.formate(filterValue))) {
                    this.annoncesAAfficher.push(annonce);
                }
            }
        );
    }

    /**
     * fonction qui parcoure la liste d'annonces pour resortir les annonces dont le prix max est inferieur ou égal au prix cherché
     * @param value la valeur du slider
     */
    filtrerParPrix(value: any) {
        this.annoncesAAfficher = [];
        this.listeAnnonces.forEach(
            annonce => {
                if (annonce.prixMax <= +value) {
                    this.annoncesAAfficher.push(annonce);
                }
            }
        );
    }

    /**
     * fonction qui calcule le prix max touts annonces confondues afin d'alimenter le slider
     * @param annonces la liste d'annonces a parcourir
     * @return number le prix maximum touts annonces
     */
    private getMax(annonces: AnnonceModel[]): number {
        let max = 0;
        if (annonces) {
            annonces.forEach(
                annonce => {
                    if (annonce.prixMax > max) {
                        max = annonce.prixMax;
                    }
                }
            );
        }
        return max;
    }


    initScripts(){
        if(document.getElementById('33883-31')) {
            const s = this.renderer2.createElement('script');
            s.src = '//ads.themoneytizer.com/s/gen.js?type=31';
            document.getElementById('33883-31').appendChild(s)

            const s2 = this.renderer2.createElement('script');
            s2.src = '//ads.themoneytizer.com/s/requestform.js?siteId=33883&formatId=31';
            document.getElementById('33883-31').appendChild(s2)
        }

        if(document.getElementById('33883-3')) {
            const s3 = this.renderer2.createElement('script');
            s3.src = '//ads.themoneytizer.com/s/gen.js?type=3';
            document.getElementById('33883-3').appendChild(s3)

            const s4 = this.renderer2.createElement('script');
            s4.src = '//ads.themoneytizer.com/s/requestform.js?siteId=33883&formatId=3';
            document.getElementById('33883-3').appendChild(s4)
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}

import {Component, HostListener, OnDestroy, OnInit, Inject} from '@angular/core';
import {AnnonceModel} from '../../../models/annonce.model';
import {AnnuaireService} from '../annuaire.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {SocketService} from '../../../shared/socket.service';
import {UsersService} from '../../../users/users.service';
import { WINDOW } from '@ng-toolkit/universal';
import { Title }  from '@angular/platform-browser';

@Component({
    selector: 'app-liste-annonces',
    templateUrl: './liste-annonces.component.html',
    styleUrls: ['./liste-annonces.component.scss']
})
export class ListeAnnoncesComponent implements OnInit, OnDestroy {

    listeAnnonces: AnnonceModel[];
    annoncesAAfficher: AnnonceModel[];
    max: number;
    subscription: Subscription;
    screenWidth: number;

    constructor(@Inject(WINDOW) private window: Window, private annuaireService: AnnuaireService, private fb: FormBuilder,
                private titleService: Title, private socket: SocketService, private userService: UsersService) {
    }

    ngOnInit() {
        this.titleService.setTitle( 'mycompanyhelper | annonces' );
        this.annuaireService.publishAnnonces();
        this.subscription = this.annuaireService.listeAnnonces$.subscribe(
            annonces => {
                this.listeAnnonces = annonces;
                this.annoncesAAfficher = this.listeAnnonces;
                this.max = this.getMax(annonces);
            }
        );
        this.socket.getAjoutAnnonce().subscribe(
            annonce => this.annuaireService.pushAnnonce(annonce)
        );
        this.socket.getDeleteAnnonce().subscribe(
            annonce => this.annuaireService.removeAnnonce(annonce.id)
        );
        this.getScreenSize()
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenWidth = this.window.innerWidth;
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

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}

import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {GenreModel} from '../../../models/genre.model';
import {ProduitModel} from '../../../models/produit.model';
import {FormBuilder} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {GenreService} from '../../genres/genre.service';
import {ProduitService} from '../produit.service';
import {MatCheckboxChange, MatIconRegistry, MatSnackBar} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {Store} from '@ngrx/store';
import {UserState} from '../../../shared/stores/user.reducer';
import {UsersService} from '../../../users/users.service';
import {SocketService} from '../../../shared/socket.service';
import {OptionsService} from '../../options/options.service';


@Component({
    selector: 'app-produits-hors-vente',
    templateUrl: './produits-hors-vente.component.html',
    styleUrls: ['./produits-hors-vente.component.scss']
})
export class ProduitsHorsVenteComponent implements OnInit, OnDestroy {

    genre: GenreModel;
    listeGenres: GenreModel[];
    elementSelectionne: ProduitModel;
    listeElements: ProduitModel[];
    listeElementsAAfficher: ProduitModel[];
    listeTriee: ProduitModel[];
    indexDebut: number;
    indexFin: number;
    pageCourante: number;
    nbPage: number;
    nbElements: number;
    limiteStock: number;
    subscriptions: Subscription[] = [];
    screenWidth: number;
    genres: GenreModel[];
    role: string;


    constructor(private route: ActivatedRoute, private genreService: GenreService, private produitService: ProduitService,
                private router: Router, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private fb: FormBuilder,
                private snackBar: MatSnackBar, private storeUser: Store<UserState>, private optionService: OptionsService,
                private socket: SocketService, private userService: UsersService) {
        iconRegistry.addSvgIcon(
            'right',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/right.svg'));
        iconRegistry.addSvgIcon(
            'left',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/left.svg'));
        this.subscriptions.push(this.optionService.options$.subscribe(
            options => {
                if (options) {
                    this.limiteStock = options.limiteStock;
                }
            }
        ));
        this.subscriptions.push(this.storeUser.select('user').subscribe(
            user => {
                if (user) {
                    this.role = user[0].authorities;
                }
            }
        ));
    }

    ngOnInit() {
        this.genreService.listeGenre$.subscribe(
            g => this.genres = g
        )
        this.initValues();
        this.getScreenSize();
        this.initSocket();
    }

    /**
     * initiation des valeurs et de la liste d'elements a afficher
     */
    initValues() {
        this.nbElements = 5;
        this.indexDebut = 0;
        this.indexFin = this.nbElements;
        this.pageCourante = 1;
        this.subscriptions.push(this.produitService.listeProduits$.subscribe(
            produits => {
                this.listeElements = [];
                produits.forEach(
                    produit => {
                        if (produit.enVente !== true) {
                            this.listeElements.push(produit);
                        }
                    }
                );
                this.nbPage = Math.ceil(this.listeElements.length / this.nbElements);
                if (this.screenWidth < 1024) {
                    this.listeElementsAAfficher = this.listeElements;
                } else {
                    this.listeElementsAAfficher = this.listeElements.slice(this.indexDebut, this.indexFin);
                }

            }
        ));
    }

    /**
     * permet de changer la couleur du texte suivant la marge
     * @param element l'element pour lequel on calcul la marge
     * @return string la couleur du texte
     */
    getColor(element: any) {
        const marge = this.produitService.marge(element.prixVente, element.prixAchat);

        if (marge < 25) {
            return 'red';
        } else {
            return 'green';
        }
    }

    /**
     * recherche dans le tableau
     * @param filterValue la chaine de caratere de l'input
     */
    rechercheTableau(filterValue: string) {
        const recherche = filterValue;
        this.listeTriee = [];
        if (recherche === '') {
            this.initTableau();
        } else {
            this.listeElements.forEach(produit => {
                for (let prop in produit) {
                    this.remplirListeTriee(produit[prop], recherche, produit);
                }

            });
            if (this.listeTriee.length !== 0) {
                this.initTableau(undefined, undefined, undefined, this.listeTriee);
            } else {
                this.initTableau();
            }
        }
    }

    /**
     * fonction qui rempli la liste a afficher avec les resultat de la recherche
     * @param entree les proprietes de l'element
     * @param recherche l'input
     * @param sortie le produit a inserer
     */
    remplirListeTriee(entree: any, recherche: string, sortie: ProduitModel) {
        if (entree.toString().toLowerCase().indexOf(recherche) !== -1) {
            if (!this.listeTriee.includes(sortie)) {
                this.listeTriee.push(sortie);
            }
        }
    }

    /**
     * pagination du tableau
     * @param direction precedente ou suivante
     */
    pagination(direction: string) {
        let liste: ProduitModel[];
        if (this.listeTriee && this.listeTriee.length !== 0) {
            liste = this.listeTriee;
        } else {
            liste = this.listeElements;
        }
        if (direction === 'left') {
            if (this.pageCourante > 1) {
                this.initTableau((this.indexDebut -= this.nbElements), (this.indexFin -= this.nbElements), (this.pageCourante -= 1), liste);
            }
        } else if (direction === 'right') {
            if (this.pageCourante < this.nbPage) {
                this.initTableau((this.indexDebut += this.nbElements), (this.indexFin += this.nbElements), (this.pageCourante += 1), liste);
            }
        }
    }

    /**
     * initialisation du tableau
     * @param indexDebut l'index de debut
     * @param indexFin l'index de fin
     * @param pageCourante la page courante
     * @param liste la liste qui sera utilisée
     */
    initTableau(indexDebut: number = 0, indexFin: number = this.nbElements, pageCourante: number = 1, liste = this.listeElements) {
        this.elementSelectionne = null;
        this.indexDebut = indexDebut;
        this.indexFin = indexFin;
        this.pageCourante = pageCourante;
        this.nbPage = Math.ceil(liste.length / this.nbElements);
        this.listeElementsAAfficher = liste.slice(this.indexDebut, this.indexFin);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    /**
     * change l'element selectionné
     * @param client le client a selectionner
     */
    changeElementSelectionne(produit: ProduitModel, e: MatCheckboxChange) {
        if(e.checked) {
            this.elementSelectionne = produit;
        } else {
            this.elementSelectionne = null
        }
    }

    /**
     * remet en vente le produit selectionné
     */
    remettreEnVente() {
        if (this.elementSelectionne) {
            this.produitService.remettreEnVente(this.elementSelectionne.idProduit).subscribe(
                () => {
                    this.socket.remisEnVenteProduit(this.elementSelectionne.idProduit);
                    this.produitService.remiseEnVente(this.elementSelectionne.idProduit);
                }
            );
        }
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenWidth = window.innerWidth;
    }

    initSocket() {
        this.socket.getDeleteProduit().subscribe(
            (data) => {
                if (data.idUser === this.userService.idUser) {
                    this.produitService.removeProduit(data.id);
                }
            }
        );
        this.socket.getRemisEnVenteProduit().subscribe(
            (data) => {
                if (data.idUser === this.userService.idUser) {
                    this.produitService.remiseEnVente(data.id);
                }
            }
        );
    }

    ajoutCat() {

    }
}

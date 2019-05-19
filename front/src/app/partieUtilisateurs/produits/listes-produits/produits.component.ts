import {Component, HostListener, OnDestroy, OnInit, Inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GenreService} from '../../genres/genre.service';
import {MatDialog, MatIconRegistry, MatSnackBar} from '@angular/material';
import {ProduitModel} from '../../../models/produit.model';
import {ProduitService} from '../produit.service';
import {GenreModel} from '../../../models/genre.model';
import {DomSanitizer} from '@angular/platform-browser';
import {Subscription} from 'rxjs';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OptionsState} from '../../../shared/stores/options.reducer';
import {Store} from '@ngrx/store';
import {UserState} from '../../../shared/stores/user.reducer';
import {UsersService} from '../../../users/users.service';
import {NotificationsService} from '../../notification/notifications.service';
import {SocketService} from '../../../shared/socket.service';
import {OptionsService} from '../../options/options.service';
import {AjoutGenreComponent} from '../../genres/ajout-genre/ajout-genre.component';


@Component({
    selector: 'app-produits',
    templateUrl: './produits.component.html',
    styleUrls: ['./produits.component.scss']
})
export class ProduitsComponent implements OnInit, OnDestroy {

    genre: GenreModel;
    listeGenres: GenreModel[];
    elementASupprimer: ProduitModel;
    listeElements: ProduitModel[];
    listeElementsAAfficher: ProduitModel[];
    listeTriee: ProduitModel[];
    elementForm: FormGroup;
    indexDebut: number;
    indexFin: number;
    pageCourante: number;
    nbPage: number;
    nbElements: number;
    limiteStock: number;
    subscriptions: Subscription[] = [];
    role: string;
    screenWidth: number;
    isDirty: boolean;
    genres: any;


    constructor(private route: ActivatedRoute, private genreService: GenreService, private produitService: ProduitService,
                private router: Router, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private fb: FormBuilder,
                private snackBar: MatSnackBar, private optionService: OptionsService, private storeUser: Store<UserState>,
                private userService: UsersService, private notificationService: NotificationsService, private socket: SocketService,
                private dialog: MatDialog) {
        iconRegistry.addSvgIcon(
            'right',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/right.svg'));
        iconRegistry.addSvgIcon(
            'left',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/left.svg'));
        iconRegistry.addSvgIcon(
            'delete',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/delete.svg'));
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
        this.isDirty = false;
        this.getScreenSize();
        this.initValues();
        this.subscriptions.push(this.genreService.listeGenre$.subscribe(
            genres => this.listeGenres = genres
        ));
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
        this.subscriptions.push(this.route.paramMap.subscribe(params => {
            if (params.get('designation')) {
                this.subscriptions.push(this.genreService.getGenre(params.get('designation')).subscribe(
                    genre => {
                        this.genre = genre;
                        this.initListe(genre.produits);
                    }
                ));
            } else {
                this.subscriptions.push(this.produitService.listeProduits$.subscribe(
                    produits => {
                        this.initListe(produits);

                    }
                ));
            }
        }));
    }

    /**
     * initialisation de la liste, avec les produits appartenant au genre si on est sur une page de genre
     * ou tout les produits si on est sur tout les produits
     * @param liste la liste qui servira a initialiser la liste d'elements a afficher
     */
    initListe(liste: ProduitModel[]) {
        this.listeElements = [];
        liste.forEach(
            produit => {
                if (produit.enVente === true) {
                    this.listeElements.push(produit);
                }
            }
        );
        this.elementForm = new FormGroup({
            elements: this.fb.array([])
        });

        this.nbPage = Math.ceil(this.listeElements.length / this.nbElements);
        if (this.screenWidth < 1024) {
            this.listeElementsAAfficher = this.listeElements;
        } else {
            this.listeElementsAAfficher = this.listeElements.slice(this.indexDebut, this.indexFin);
        }
        this.initForm(this.listeElementsAAfficher);
    }

    /**
     * ajoute un element vide
     */
    onAjouter() {
        if (this.listeGenres && this.listeGenres.length > 0) {
            this.elements.insert(0, this.fb.group({
                idProduit: [''],
                designation: [''],
                prixAchat: [0],
                prixVente: [0],
                quantite: [0, Validators.compose([Validators.required, Validators.min(0)])],
                factures: this.fb.array([]),
                genre: [this.genre ? this.genre.idGenre : '', Validators.required]
            }));
        } else {
            this.snackBar.open('Merci de créer une catégorie avant de créer un produit', 'ok', {duration: 1500, verticalPosition: 'top'});
        }
    }

    /**
     * supprime l'element selectionné
     */
    onSupprimer() {
        if (this.elementASupprimer) {
            this.produitService.deleteProduit(this.elementASupprimer.idProduit).subscribe(
                () => {
                    this.socket.deleteProduit(this.elementASupprimer.idProduit);
                    this.produitService.removeProduit(this.elementASupprimer.idProduit);
                }
            );
        }
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
     * supprime le genre de la page
     * @param idGenre l'identifiant du genre
     */
    onDeleteGenre(idGenre: number) {
        this.genreService.deleteGenre(idGenre);
        this.router.navigate(['users' +
        '/produits']);
    }

    /**
     * initialisation du formulaire
     * @param liste la liste a utiliser
     */
    private initForm(liste: ProduitModel[]) {
        const elements = this.elementForm.get('elements') as FormArray;
        liste.forEach(
            element => {
                elements.push(this.fb.group({
                    idProduit: [element.idProduit],
                    designation: [element.designation],
                    prixAchat: [element.prixAchat],
                    prixVente: [element.prixVente],
                    quantite: [element.quantite, Validators.compose([Validators.required, Validators.min(0)])],
                    factures: this.fb.array(element.factures),
                    genre: [element.genre ? element.genre.idGenre : '', Validators.required]
                }));
            }
        );
    }

    get elements() {
        return this.elementForm.get('elements') as FormArray;
    }

    /**
     * envoi du formulaire en appuyant sur la touche entrée
     * @param event appui sur la touche entree
     */
    @HostListener('document:keydown.enter', ['$event']) envoiForm(event?: KeyboardEvent) {
        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements.controls[i].status === 'VALID') {
                const produit = this.elements.value[i];
                if (produit.idProduit === '') {
                    this.envoi(produit, 'creer');
                } else if (this.elements.controls[i].dirty) {
                    this.envoi(produit, 'modifier');
                }
            } else {
                this.snackBar.open('Merci d\'affecter une catégorie à tout vos produits.', 'ok', {duration: 1500, verticalPosition: 'top'});
            }
        }
    }

    /**
     * change l'element selectionné
     * @param client le client a selectionner
     */
    changeElementSelectionne(produit: ProduitModel) {
        this.elementASupprimer = produit;
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
        this.elementASupprimer = null;
        this.viderForm();
        this.indexDebut = indexDebut;
        this.indexFin = indexFin;
        this.pageCourante = pageCourante;
        this.nbPage = Math.ceil(liste.length / this.nbElements);
        this.listeElementsAAfficher = liste.slice(this.indexDebut, this.indexFin);
        this.initForm(this.listeElementsAAfficher);
    }

    /**
     * vide le formulaire (a chaque recherche il faut vider le formulaire pour le reinitialiser
     */
    viderForm() {
        this.elementForm = new FormGroup({
            elements: this.fb.array([])
        });
    }

    /**
     * methode d'envoi du formulaire
     * @param produit le produit a envoyer
     * @param mode creation ou modification
     */
    envoi(produit: any, mode: string) {
        const produitAEnvoyer: ProduitModel = {
            idProduit: produit.idProduit,
            designation: produit.designation,
            prixVente: produit.prixVente,
            prixAchat: produit.prixAchat,
            quantite: produit.quantite,
            factures: produit.factures,
            idUser: this.userService.idUser,
            enVente: true,
        };
        this.listeGenres.forEach(genre => {
            if (genre.idGenre === +produit.genre) {
                produitAEnvoyer.genre = genre;
            }
        });

        if (mode === 'creer') {
            this.produitService.saveProduit(produitAEnvoyer).subscribe(
                produit => {
                    this.socket.ajoutProduit(produit);
                    this.produitService.pushProduit(produit);
                    this.isDirty = false;
                }
            );
            this.snackBar.open('le produit a bien été enregistré.', 'ok', {duration: 1500, verticalPosition: 'top'});
        } else if (mode === 'modifier') {
            this.produitService.modifProduit(produitAEnvoyer).subscribe(
                produit => {
                    this.socket.modifProduit(produit);
                    this.produitService.replaceProduit(produit);
                    this.isDirty = false;
                }
            );
            this.snackBar.open('les changements ont bien été pris en compte.', 'ok', {duration: 1500, verticalPosition: 'top'});
            if (produit.quantite > this.limiteStock) {
                this.notificationService.mettreVue(produit.idProduit);
            }
        }
    }

    /**
     * methode pour recuperer la largeur de l'ecran afin de rendre la page responsive (en plus du css)
     */
    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenWidth = window.innerWidth;
    }

    changeIsDirty() {
        this.isDirty = true;
    }

    ngOnDestroy(): void {
        if (this.subscriptions.length > 0) {
            this.subscriptions.forEach(subscription => subscription.unsubscribe());
        }
    }

    initSocket() {
        this.socket.getAjoutProduit().subscribe(
            (data) => {
                if (data.idUser === this.userService.idUser) {
                    this.produitService.pushProduit(data.produit);
                }
            }
        );
        this.socket.getModifProduit().subscribe(
            (data) => {
                if (data.idUser === this.userService.idUser) {
                    this.produitService.replaceProduit(data.produit);
                }
            }
        );
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

    /**
     * ouverture de la lightbox d'ajout de genre
     */
    ajoutCat() {
        this.dialog.open(AjoutGenreComponent);
    }
}

import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FournisseursService} from '../fournisseurs.service';
import {MatCheckboxChange, MatDialog, MatIconRegistry, MatSnackBar} from '@angular/material';
import {FournisseurModel} from '../../../models/fournisseur.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {GenreService} from '../../genres/genre.service';
import {GenreModel} from '../../../models/genre.model';
import {DialogFournisseursComponent} from './dialog-fournisseurs/dialog-fournisseurs.component';
import {Store} from '@ngrx/store';
import {UserState} from '../../../shared/stores/user.reducer';
import {UsersService} from '../../../users/users.service';
import {SocketService} from '../../../shared/socket.service';
import {ProduitModel} from "../../../models/produit.model";


@Component({
    selector: 'app-fournisseurs-liste',
    templateUrl: './fournisseurs-liste.component.html',
    styleUrls: ['./fournisseurs-liste.component.scss']
})
export class FournisseursListeComponent implements OnInit, OnDestroy {

    listeGenres: GenreModel[];
    selection: FournisseurModel[];
    listeElements: FournisseurModel[];
    listeElementsAAfficher: FournisseurModel[];
    listeTriee: FournisseurModel[];
    elementForm: FormGroup;
    indexDebut: number;
    indexFin: number;
    pageCourante: number;
    nbPage: number;
    nbElements: number;
    subscriptions: Subscription[] = [];
    role: string;
    screenWidth: number;
    isDirty: boolean;
    allSelected: boolean;



    constructor(private route: ActivatedRoute, private fournisseurService: FournisseursService,
                private router: Router, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private fb: FormBuilder,
                private snackBar: MatSnackBar, private genreService: GenreService, public dialog: MatDialog,
                private storeUser: Store<UserState>, private  userService: UsersService,
                private socket: SocketService) {
        iconRegistry.addSvgIcon(
            'right',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/right.svg'));
        iconRegistry.addSvgIcon(
            'left',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/left.svg'));
        this.subscriptions.push(this.storeUser.select('user').subscribe(
            user => {
                if (user) {
                    this.role = user[0].authorities;
                }
            }
        ));
    }

    ngOnInit() {
        this.allSelected = false;
        this.selection = [];
        this.isDirty = false;
        this.getScreenSize();
        this.initValues();
        this.initSocket();
    }

    initSocket() {
        this.socket.getAjoutFournisseur().subscribe(
            data => {
                if (data.idUser === this.userService.idUser) {
                    this.fournisseurService.pushFournisseur(data.fournisseur);
                }
            }
        );
        this.socket.getModifFournisseur().subscribe(
            data => {
                if (data.idUser === this.userService.idUser) {
                    this.fournisseurService.replaceFournisseur(data.fournisseur);
                }
            }
        );
        this.socket.getDeleteFournisseur().subscribe(
            data => {
                if (data.idUser === this.userService.idUser) {
                    this.fournisseurService.removeFournisseur(data.id);
                }
            }
        );
    }

    /**
     * initiation des valeurs et de la liste d'elements a afficher
     */
    initValues() {
        this.nbElements = 5;
        this.indexDebut = 0;
        this.indexFin = this.nbElements;
        this.pageCourante = 1;
        this.subscriptions.push(this.fournisseurService.listeFournisseurs$.subscribe(
            fournisseurs => {
                this.listeElements = fournisseurs;
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
        ));
        this.subscriptions.push(this.genreService.listeGenre$.subscribe(
            genres => this.listeGenres = genres
        ));
    }

    /**
     * ajoute un element vide
     */
    onAjouter() {
        this.elements.insert(0, this.fb.group({
            idFournisseur: [''],
            nom: [''],
            adresse: [''],
            codePostal: [''],
            produits: [''],
            telephone: [''],
            email: [''],
            ville: ['']
        }));
    }


    /**
     * supprime l'element selectionné
     */
    onSupprimer() {
        if (this.selection) {
            this.selection.forEach(
                f => {
                    this.fournisseurService.deleteFournisseur(f.idFournisseur).subscribe(
                        () => {
                            this.socket.deleteFournisseur(f.idFournisseur);
                            this.fournisseurService.removeFournisseur(f.idFournisseur);
                        }
                    );
                }
            )
        }
    }

    /**
     * initialisation du formulaire
     * @param liste la liste a utiliser
     */
    private initForm(liste: FournisseurModel[]) {
        const elements = this.elementForm.get('elements') as FormArray;
        liste.forEach(
            element => {
                let produitsNom = [];
                element.categories.forEach(cat => produitsNom.push(cat.designation));
                const produits = produitsNom.join();
                elements.push(this.fb.group({
                    idFournisseur: [element.idFournisseur],
                    nom: [{value: element.nom, disabled: this.screenWidth < 1024 && this.role !== 'ROLE_ADMIN'}],
                    adresse: [element.adresse],
                    codePostal: [element.codePostal],
                    produits: [{value: produits, disabled: this.screenWidth < 1024 && this.role !== 'ROLE_ADMIN'}],
                    telephone: [{value: element.telephone, disabled: this.screenWidth < 1024 && this.role !== 'ROLE_ADMIN'}],
                    email: [{value: element.email, disabled: this.screenWidth < 1024 && this.role !== 'ROLE_ADMIN'}],
                    ville: [element.ville]
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
                const fournisseur = this.elements.value[i];
                if (fournisseur.idFournisseur === '') {
                    this.envoi(fournisseur, 'creer');
                } else if (this.elements.controls[i].dirty || fournisseur.produits !== this.listeElements[i].categories.join(',')) {
                    this.envoi(fournisseur, 'modifier');
                }
            } else {
                this.snackBar.open('l\'envoi a échoué, merci de verifier les champs', 'ok', {duration: 1500, verticalPosition: 'top'});
            }
        }
    }

    /**
     * change l'element selectionné
     * @param client le client a selectionner
     */
    changeSelection(fournisseur: FournisseurModel, e: MatCheckboxChange) {
        const index = this.selection.findIndex(f => f === fournisseur);
        if(e.checked && index === -1) {
            this.selection.push(fournisseur);
        } else {
            this.selection.splice(index, 1);
            if(this.selection.length === 0) {
                this.allSelected = false
            }
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
            this.listeElements.forEach(fournisseur => {
                for (let prop in fournisseur) {
                    this.remplirListeTriee(fournisseur[prop], recherche, fournisseur);
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
     * @param sortie le fournisseur a inserer
     */
    remplirListeTriee(entree: any, recherche: string, sortie: FournisseurModel) {
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
        let liste: FournisseurModel[];
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
        this.selection = null;
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
     * @param client le fournisseur a envoyer
     * @param mode creation ou modification
     */
    envoi(fournisseur: any, mode: string) {
        let categories = [];
        const produits = fournisseur.produits.split(',');
        produits.forEach(
            produit => {
                this.listeGenres.forEach(
                    genre => {
                        if (genre.designation === produit) {
                            categories.push(genre);
                        }
                    }
                );
            }
        );
        const fournisseurAEnvoyer: FournisseurModel = {
            idFournisseur: fournisseur.idFournisseur,
            nom: fournisseur.nom,
            telephone: fournisseur.telephone,
            email: fournisseur.email,
            categories: categories,
            ville: fournisseur.ville,
            codePostal: fournisseur.codePostal,
            adresse: fournisseur.adresse,
            idUser: this.userService.idUser
        };

        if (mode === 'creer') {
            this.fournisseurService.saveFournisseur(fournisseurAEnvoyer).subscribe(
                fournisseur => {
                    this.socket.ajoutFournisseur(fournisseur);
                    this.fournisseurService.pushFournisseur(fournisseur);
                    this.isDirty = false;
                }
            );
            this.snackBar.open('le fournisseur a bien été enregistré.', 'ok', {duration: 1500, verticalPosition: 'top'});
        } else if (mode === 'modifier') {
            this.fournisseurService.modifFournisseur(fournisseurAEnvoyer).subscribe(
                fournisseur => {
                    this.socket.modifFournisseur(fournisseur);
                    this.fournisseurService.replaceFournisseur(fournisseur);
                    this.isDirty = false;
                }
            );
            this.snackBar.open('les changements ont bien été pris en compte.', 'ok', {duration: 1500, verticalPosition: 'top'});
        }
    }

    changeIsDirty() {
        this.isDirty = true;
    }

    /**
     * ouverture de la lightbox, a la fermeture de la lightbox, on recupere les genres
     * selectionnés, on envoi le formulaire et on ajoute les noms des genres dans le champ
     * @param fournisseur
     * @param index
     */
    openDialog(fournisseur: any, index: number): void {
        if (this.role === 'ROLE_ADMIN') {
            const categories = fournisseur.produits.split(',');
            const dialogRef = this.dialog.open(DialogFournisseursComponent, {
                width: '250px',
                data: {listeGenres: this.listeGenres, cat: categories, index: index}
            });

            dialogRef.afterClosed().subscribe(result => {
                let categories = [];
                Object.values(result[0]).forEach(
                    result => {
                        this.listeGenres.forEach(
                            genre => {
                                if (genre.designation === result) {
                                    categories.push(genre);
                                }
                            }
                        );
                    }
                );
                this.elements.value[Number(result[1])].produits = Object.values(result[0]).join(',');
                this.envoiForm();
                if (this.listeElements[Number(result[1])]) {
                    this.listeElements[Number(result[1])].categories = categories;
                }
                this.initTableau(this.indexDebut, this.indexFin, this.pageCourante, this.listeElements);
            });
        }
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenWidth = window.innerWidth;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    isSelected(value: FournisseurModel): boolean {
        if (this.selection.findIndex(f => f === value) !== -1) {
            return true;
        } else {
            return false;
        }
    }

    selectAll(e: MatCheckboxChange) {
        console.log(e.checked)
        if(e.checked) {
            this.listeElements.forEach(
                f => this.selection.push(f)
            )
            this.allSelected = true;
        } else {
            this.selection = [];
            this.allSelected = false;
        }
    }
}

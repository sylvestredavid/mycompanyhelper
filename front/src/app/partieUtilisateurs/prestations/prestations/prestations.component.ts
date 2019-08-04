import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {PrestationsService} from '../prestations.service';
import {MatCheckboxChange, MatDialog, MatIconRegistry, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {Store} from '@ngrx/store';
import {UserState} from '../../../shared/stores/user.reducer';
import {UsersService} from '../../../users/users.service';
import {SocketService} from '../../../shared/socket.service';
import {PrestationModel} from '../../../models/prestation.model';
import {EntrepriseModel} from "../../../models/entreprise.model";
import {EntrepriseService} from "../../entreprise/entreprise.service";


@Component({
    selector: 'app-prestations',
    templateUrl: './prestations.component.html',
    styleUrls: ['./prestations.component.scss']
})
export class PrestationsComponent implements OnInit, OnDestroy {

    selection: PrestationModel[];
    listeElements: PrestationModel[];
    listeElementsAAfficher: PrestationModel[];
    listeTriee: PrestationModel[];
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
    entreprise: EntrepriseModel;



    constructor(private route: ActivatedRoute, private prestationsService: PrestationsService,
                private router: Router, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private fb: FormBuilder,
                private snackBar: MatSnackBar, public dialog: MatDialog,
                private storeUser: Store<UserState>, private  userService: UsersService, private entrepriseService: EntrepriseService,
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
        this.entrepriseService.entreprise$.subscribe(
            e => this.entreprise = e
        )
        this.allSelected = false;
        this.selection = [];
        this.isDirty = false;
        this.getScreenSize();
        this.initValues();
    }

    /**
     * initiation des valeurs et de la liste d'elements a afficher
     */
    initValues() {
        this.nbElements = 5;
        this.indexDebut = 0;
        this.indexFin = this.nbElements;
        this.pageCourante = 1;
        this.subscriptions.push(this.prestationsService.listePrestations$.subscribe(
            prestation => {
                this.listeElements = prestation;
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
    }

    /**
     * ajoute un element vide
     */
    onAjouter() {
        this.elements.insert(0, this.fb.group({
            id: [''],
            designation: [''],
            prix: [0],
            unitee: [''],
            tva: [0]
        }));
    }


    /**
     * supprime l'element selectionné
     */
    onSupprimer() {
        if (this.selection) {
            this.selection.forEach(
                p => {
                    this.prestationsService.deletePrestation(p.id).subscribe(
                        () => {
                            this.socket.deletePrestation(p.id);
                            this.prestationsService.removePrestation(p.id);
                        }
                    );
                }
            );
        }
    }

    /**
     * initialisation du formulaire
     * @param liste la liste a utiliser
     */
    private initForm(liste: PrestationModel[]) {
        const elements = this.elementForm.get('elements') as FormArray;
        liste.forEach(
            element => {
                elements.push(this.fb.group({
                    id: [element.id],
                    designation: [element.designation],
                    prix: [element.prix],
                    tva: [element.tva],
                    unitee: [element.unitee],
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
                const prestation = this.elements.value[i];
                if (prestation.id === '') {
                    this.envoi(prestation, 'creer');
                } else if (this.elements.controls[i].dirty) {
                    this.envoi(prestation, 'modifier');
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
    changeSelection(prestation: PrestationModel, e: boolean) {
        const index = this.selection.findIndex(f => f === prestation);
        if (e && index === -1) {
            this.selection.push(prestation);
        } else {
            this.selection.splice(index, 1);
            if (this.selection.length === 0) {
                this.allSelected = false;
            }
        }
        console.log(this.selection)
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
            this.listeElements.forEach(prestation => {
                for (const prop in prestation) {
                    this.remplirListeTriee(prestation[prop], recherche, prestation);
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
     * @param sortie le prestation a inserer
     */
    remplirListeTriee(entree: any, recherche: string, sortie: PrestationModel) {
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
        let liste: PrestationModel[];
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
     * @param client le prestation a envoyer
     * @param mode creation ou modification
     */
    envoi(prestation: any, mode: string) {
        const prestationAEnvoyer: PrestationModel = {
            id: prestation.id,
            designation: prestation.designation,
            unitee: prestation.unitee,
            tva: prestation.tva,
            prix: prestation.prix,
            idUser: this.userService.idUser
        };

        if (mode === 'creer') {
            this.prestationsService.savePrestation(prestationAEnvoyer).subscribe(
                prestation => {
                    this.socket.ajoutPrestation(prestation);
                    this.prestationsService.pushPrestation(prestation);
                    this.isDirty = false;
                }
            );
            this.snackBar.open('le prestation a bien été enregistré.', 'ok', {duration: 1500, verticalPosition: 'top'});
        } else if (mode === 'modifier') {
            this.prestationsService.modifPrestation(prestationAEnvoyer).subscribe(
                prestation => {
                    this.socket.modifPrestation(prestation);
                    this.prestationsService.replacePrestation(prestation);
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
     * @param prestation
     * @param index
     */
    openDialog(prestation: any, index: number): void {

    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenWidth = window.innerWidth;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    isSelected(value: PrestationModel): boolean {
        if (this.selection.findIndex(f => f === value) !== -1) {
            return true;
        } else {
            return false;
        }
    }

    selectAll(e: MatCheckboxChange) {
        console.log(e.checked);
        if (e.checked) {
            this.listeElements.forEach(
                f => this.selection.push(f)
            );
            this.allSelected = true;
        } else {
            this.selection = [];
            this.allSelected = false;
        }
    }
}

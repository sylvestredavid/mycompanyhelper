import {Component, HostListener, OnDestroy, OnInit, Inject} from '@angular/core';
import {MatIconRegistry, MatSnackBar} from '@angular/material';
import {ClientModel} from '../../../models/client.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {GenreService} from '../../genres/genre.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ClientsService} from '../clients.service';
import {Store} from '@ngrx/store';
import {UserState} from '../../../shared/stores/user.reducer';
import {UsersService} from '../../../users/users.service';
import {SocketService} from '../../../shared/socket.service';


@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit, OnDestroy {

    elementSelectionne: ClientModel;
    listeElements: ClientModel[];
    listeElementsAAfficher: ClientModel[];
    listeTriee: ClientModel[];
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


    constructor(private route: ActivatedRoute, private genreService: GenreService, private clientService: ClientsService,
                private router: Router, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private fb: FormBuilder,
                private snackBar: MatSnackBar, private storeUser: Store<UserState>, private userService: UsersService,
                private socket: SocketService) {
        iconRegistry.addSvgIcon(
            'right',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/right.svg'));
        iconRegistry.addSvgIcon(
            'left',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/left.svg'));
        this.subscriptions.push(this.storeUser.select('user').subscribe(
            user => this.role = user[0].authorities
        ));
    }

    ngOnInit() {
        this.isDirty = false;
        this.getScreenSize();
        this.initValues();
        this.initSocket();
    }

    initSocket() {
        this.socket.getAjoutClient().subscribe(
            data => {
                if (data.idUser === this.userService.idUser) {
                    this.clientService.pushClient(data.client);
                }
            }
        );
        this.socket.getModifClient().subscribe(
            data => {
                if (data.idUser === this.userService.idUser) {
                    this.clientService.replaceClient(data.client);
                }
            }
        );
        this.socket.getDeleteClient().subscribe(
            data => {
                if (data.idUser === this.userService.idUser) {
                    this.clientService.removeClient(data.id);
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
        this.subscriptions.push(this.clientService.listeClients$.subscribe(
            clients => {
                this.listeElements = clients;
                this.elementForm = new FormGroup({
                    elements: this.fb.array([])
                });

                this.nbPage = Math.ceil(this.listeElements.length / this.nbElements);
                if( this.screenWidth < 1024) {
                    this.listeElementsAAfficher = this.listeElements
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
            idClient: [''],
            nom: [''],
            prenom: [''],
            adresse: [''],
            codePostal: [''],
            factures: this.fb.array([]),
            telephone: [''],
            email: [''],
            ville: ['']
        }));
    }

    /**
     * supprime l'element selectionné
     */
    onSupprimer() {
        if (this.elementSelectionne) {
            this.clientService.deleteClient(this.elementSelectionne.idClient).subscribe(
                () => {
                    this.socket.deleteClient(this.elementSelectionne.idClient);
                    this.clientService.removeClient(this.elementSelectionne.idClient);
                }
            );
        }
    }

    /**
     * initialisation du formulaire
     * @param liste la liste a utiliser
     */
    private initForm(liste: ClientModel[]) {
        const elements = this.elementForm.get('elements') as FormArray;
        liste.forEach(
            element => {
                elements.push(this.fb.group({
                    idClient: [element.idClient],
                    nom: [{value: element.nom, disabled: this.screenWidth < 1024 && this.role !== 'ROLE_ADMIN'}],
                    prenom: [{value: element.prenom, disabled: this.screenWidth < 1024 && this.role !== 'ROLE_ADMIN'}],
                    adresse: [{value: element.adresse, disabled: this.screenWidth < 1024 && this.role !== 'ROLE_ADMIN'}],
                    codePostal: [{value: element.codePostal, disabled: this.screenWidth < 1024 && this.role !== 'ROLE_ADMIN'}],
                    factures: this.fb.array(element.factures),
                    telephone: [{value: element.telephone, disabled: this.screenWidth < 1024 && this.role !== 'ROLE_ADMIN'}],
                    email: [{value: element.email, disabled: this.screenWidth < 1024 && this.role !== 'ROLE_ADMIN'}],
                    ville: [{value: element.ville, disabled: this.screenWidth < 1024 && this.role !== 'ROLE_ADMIN'}]
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
                const client = this.elements.value[i];
                if (client.idClient === '') {
                    this.envoi(client, 'creer');
                } else if (this.elements.controls[i].dirty) {
                    this.envoi(client, 'modifier');
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
    changeElementSelectionne(client: ClientModel) {
        this.elementSelectionne = client;
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
            this.listeElements.forEach(client => {
                for (let prop in client) {
                    this.remplirListeTriee(client[prop], recherche, client);
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
     * @param sortie le client a inserer
     */
    remplirListeTriee(entree: any, recherche: string, sortie: ClientModel) {
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
        let liste: ClientModel[];
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
     * @param client le client a envoyer
     * @param mode creation ou modification
     */
    envoi(client: any, mode: string) {
        const ClientAEnvoyer: ClientModel = {
            idClient: client.idClient,
            nom: client.nom,
            prenom: client.prenom,
            telephone: client.telephone,
            email: client.email,
            factures: client.factures,
            ville: client.ville,
            codePostal: client.codePostal,
            adresse: client.adresse,
            idUser: this.userService.idUser
        };

        if (mode === 'creer') {
            this.clientService.saveClient(ClientAEnvoyer).subscribe(
                client => {
                    this.socket.ajoutClient(client);
                    this.clientService.pushClient(client);
                    this.isDirty = false;
                }
            );
            this.snackBar.open('le client a bien été enregisré.', 'ok', {duration: 1500, verticalPosition: 'top'});
        } else if (mode === 'modifier') {
            this.clientService.modifClient(ClientAEnvoyer).subscribe(
                client => {
                    this.socket.modifClient(client);
                    this.clientService.replaceClient(client);
                    this.isDirty = false;
                }
            );
            this.snackBar.open('les changements ont bien été pris en compte.', 'ok', {duration: 1500, verticalPosition: 'top'});
        }
    }

    changeIsDirty(){
        this.isDirty = true;
    }

    /**
     * navigation vers la page detail du client selectionné
     */
    onDetails() {
        if (this.elementSelectionne) {
            this.router.navigate(['users/clients/detailClient/' + this.elementSelectionne.idClient]);
        }
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenWidth = window.innerWidth;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}

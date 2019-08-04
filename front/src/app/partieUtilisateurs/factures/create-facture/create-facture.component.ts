import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ClientsService} from '../../clients/clients.service';
import {MatIconRegistry, MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {ClientModel} from '../../../models/client.model';
import {ProduitService} from '../../produits/produit.service';
import {ProduitModel} from '../../../models/produit.model';
import {FactureModel} from '../../../models/facture.model';
import {FactureService} from '../facture.service';
import {Router} from '@angular/router';
import * as jsPDF from 'jspdf';
import {Subscription} from 'rxjs';
import {UsersService} from '../../../users/users.service';
import {NotificationsService} from '../../notification/notifications.service';
import {NotificationModel} from '../../../models/notification.model';
import {CustomValidators} from '../../../shared/validators/custom.validator';
import {finalize, map} from 'rxjs/operators';
import {DatePipe} from '@angular/common';
import html2canvas from 'html2canvas';
import {Store} from '@ngrx/store';
import {UserState} from '../../../shared/stores/user.reducer';
import {EntrepriseService} from '../../entreprise/entreprise.service';
import {EntrepriseModel} from '../../../models/entreprise.model';
import {SocketService} from '../../../shared/socket.service';
import {PrestationsService} from '../../prestations/prestations.service';
import {PrestationModel} from '../../../models/prestation.model';


@Component({
    selector: 'app-create-facture',
    templateUrl: './create-facture.component.html',
    styleUrls: ['./create-facture.component.scss']
})
export class CreateFactureComponent implements OnInit, OnDestroy {

    isLinear = true;
    private snackBarRef: MatSnackBarRef<SimpleSnackBar>;
    clientForm: FormGroup;
    produitsForm: FormGroup;
    produitsFormArray: FormArray;
    prestationsForm: FormGroup;
    prestationsFormArray: FormArray;
    remiseForm: FormGroup;
    clients: ClientModel[];
    listeProduits: ProduitModel[];
    messageQueue: string[] = [];
    subscriptions: Subscription[] = [];
    screenWidth: number;
    email: string;
    enCour: boolean;
    entreprise: EntrepriseModel;
    numero: number;
    devisForm: FormGroup;
    enregistree: boolean;
    facture: FactureModel;
    date: Date;
    private listePrestations: PrestationModel[];

    constructor(private _formBuilder: FormBuilder, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
                private clientService: ClientsService, private produitService: ProduitService, private factureService: FactureService,
                private router: Router, private snackBar: MatSnackBar, private userService: UsersService, private prestationsService: PrestationsService,
                private notificationService: NotificationsService, private datePipe: DatePipe, private store: Store<UserState>,
                private entrepriseService: EntrepriseService, private socket: SocketService) {
        iconRegistry.addSvgIcon(
            'edit',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/edit.svg'));

        this.store.select('user').subscribe(
            user => {
                if (user) {
                    this.email = user[0].username;
                }
            }
        );
    }

    ngOnInit() {
        this.enregistree = false;
        this.factureService.findAllFactures().subscribe(
            factures => {
                if (factures && factures.length > 0) {
                    factures.sort(function (a, b) {
                        return b.numero - a.numero;
                    });
                    this.numero = factures[0].numero + 1;
                } else {
                    this.numero = 1534;
                }
            }
        );
        this.date = new Date();
        this.entrepriseService.entreprise$.subscribe(
            e => this.entreprise = e
        );
        this.initClients();
        this.initProduits();
        this.initPrestations();
        this.initForms();
        this.getScreenSize();
        this.enCour = false;
    }

    get prestations() {
        return this.prestationsFormArray = this.prestationsForm.get('prestations') as FormArray;
    }

    get produits() {
        return this.produitsFormArray = this.produitsForm.get('produits') as FormArray;
    }

    /**
     * recuperation des clients
     */
    initClients() {
        this.clientService.publishClients();
        this.subscriptions.push(this.clientService.listeClients$.subscribe(clients => this.clients = clients));
    }

    /**
     * recuperations des produits, si ils sont en vente, on les ajoutes a la liste
     */
    initProduits() {
        this.produitService.publishProduits();
        this.subscriptions.push(this.produitService.listeProduits$.pipe(
            map(produits => {
                return produits.filter(produit => {
                    return produit.enVente === true && produit.quantite > 0;
                });
            })
        ).subscribe(
            produits => {
                this.listeProduits = produits;
            }
        ));
    }

    initPrestations() {
        this.subscriptions.push(this.prestationsService.listePrestations$.subscribe(
            p => {
                this.listePrestations = p;
            }
        ));
    }

    /**
     * initialisation des formulaires
     */
    initForms() {
        this.clientForm = this._formBuilder.group({
            client: ['', Validators.required]
        });
        this.produitsForm = this._formBuilder.group({
            produits: this._formBuilder.array([])
        });
        this.prestationsForm = this._formBuilder.group({
            prestations: this._formBuilder.array([])
        });
        this.remiseForm = this._formBuilder.group({
            remise: [0]
        });
        this.devisForm = this._formBuilder.group({
            type: ['Facture']
        });
    }

    /**
     * crée un nouveau formulaire de prestation vide
     */
    private createProduits(): FormGroup {
        return this._formBuilder.group({
            produit: ['', CustomValidators.produitValidator()],
            quantite: ['', CustomValidators.quantiteeValidator()]
        });
    }

    private createPrestations(): FormGroup {
        return this._formBuilder.group({
            prestation: [''],
            quantite: ['']
        });
    }

    /**
     * ajoute le formulaire de prestation vide au formarray
     */
    addProduit(): void {
        this.produits.push(this.createProduits());
    }

    addPrestation(): void {
        this.prestations.push(this.createPrestations());
    }

    /**
     * envoi de la facture
     */
    onSubmit() {
        this.messageQueue = [];
        this.messageQueue.push('email envoyé.')
        if (!this.enregistree) {
            this.enregisterFacture(true);
        } else {
            this.factureService.sendMail(this.facture.idFacture);
            this.showNext()
        }
    }

    /**
     * affiche la liste de produits pour l'auto completion
     * @param produit le prestation dans l'input
     */
    displayFn(produit?: ProduitModel): string | undefined {
        return produit ? produit.designation : undefined;
    }

    /**
     * calcul le total de la facture
     * @param produits les inputs du formarray
     */
    getTotalHT(produits: AbstractControl[], prestations: AbstractControl[]): number {
        let total = 0;
        for (const control of produits) {
            total += (control.value.produit.prixVente * control.value.quantite);
        }
        for (const control of prestations) {
            total += (control.value.prestation.prix * control.value.quantite);
        }
        return total;
    }

    /**
     * verifie les stocks et envoie des notifications en cas de stock bas
     * @param produits la liste de produits a verifier
     */
    checkStock(produit: ProduitModel, quantite: number) {
        if ((produit.quantite - quantite) <= produit.seuilStockBas && produit.quantite > 0) {
            console.log('coucou');
            const notif: NotificationModel = {
                notification: `le produit "${produit.designation}" est bientot en rupture de stock.`,
                vue: false,
                idProduit: produit.idProduit,
                idUser: this.userService.idUser
            };
            this.notificationService.saveNotification(notif);
            this.factureService.sendMailStockBas(this.email, produit.designation);
            this.messageQueue.push(`le produit "${produit.designation}" est bientot en rupture de stock.`);
        }
        if (produit.quantite === 0) {
            const notif: NotificationModel = {
                notification: `le produit "${produit.designation}" est en rupture de stock.`,
                vue: false,
                idProduit: produit.idProduit,
                idUser: this.userService.idUser
            };
            this.notificationService.saveNotification(notif);
            this.factureService.sendMailStockBas(this.email, produit.designation);
            this.messageQueue.push(`le produit "${produit.designation}" est en rupture de stock.`);
        }
    }

    /**
     * affiche les snackbars les unes apres les autres
     */
    showNext() {
        if (this.messageQueue.length === 0) {
            return;
        }

        const message = this.messageQueue.shift();
        this.snackBarRef = this.snackBar.open(message, 'ok', {duration: 1500, verticalPosition: 'top'});
        this.snackBarRef.afterDismissed().subscribe(() => {
            this.showNext();
        });
    }

    /**
     * supprimer un formulaire de prestation du formarray
     * @param i l'indes du formarray a supprimer
     */
    supprimerProduit(i: number) {
        this.produits.removeAt(i);
    }

    supprimerPrestation(i: number) {
        this.prestations.removeAt(i);
    }

    ngOnDestroy(): void {
        if (this.subscriptions.length > 0) {
            this.subscriptions.forEach(subscription => subscription.unsubscribe());
        }
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenWidth = window.innerWidth;
    }


    /**
     * fonction de téléchargement de la facture au format pdf
     */
    public generatePDF() {
        if (!this.enregistree) {
            this.enregisterFacture(false);
        }
        const nom = this.devisForm.value.type === 'Facture' ?
            `facture-${this.clientForm.value.client.nom}-${this.clientForm.value.client.prenom}-${this.datePipe.transform(new Date(), 'dd/MM/yy')}.pdf` :
            `devis-${this.clientForm.value.client.nom}-${this.clientForm.value.client.prenom}-${this.datePipe.transform(new Date(), 'dd/MM/yy')}.pdf`;
        const data = document.getElementById('facture');
        html2canvas(data).then(canvas => {
            // Few necessary setting options
            const imgWidth = 208;
            const pageHeight = 295;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            const heightLeft = imgHeight;

            const contentDataURL = canvas.toDataURL('image/png');
            const pdf = new jsPDF(); // A4 size page of PDF
            const position = 0;
            pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
            pdf.save(nom); // Generated PDF
        });
    }

    tvaExist(produits: AbstractControl[], prestations: AbstractControl[], tva: number): boolean {
        for (const control of produits) {
            if (control.value.produit.tva === tva) {
                return true;
            }
        }
        for (const control of prestations) {
            if (control.value.prestation.tva === tva) {
                return true;
            }
        }
        return false;
    }

    getTotalTva(produits: AbstractControl[], prestations: AbstractControl[], tva: number): number {
        let total = 0;
        for (const control of produits) {
            if (control.value.produit.tva === tva) {
                total += ((control.value.produit.prixVente * tva / 100) * control.value.quantite);
            }
        }
        for (const control of prestations) {
            if (control.value.prestation.tva === tva) {
                total += ((control.value.prestation.prix * tva / 100) * control.value.quantite);
            }
        }
        return +total.toFixed(2);
    }

    getTotalTTC(produits: AbstractControl[], prestations: AbstractControl[]): number {
        let total = 0;
        for (const control of produits) {
            total += ((control.value.produit.prixVente + (control.value.produit.prixVente * control.value.produit.tva / 100)) * control.value.quantite);
        }
        for (const control of prestations) {
            total += ((control.value.prestation.prix + (control.value.prestation.prix * control.value.prestation.tva / 100)) * control.value.quantite);
        }

        total = total - (total * this.remiseForm.value.remise / 100);
        return +total.toFixed(2);
    }

    calculPanierMoyen(client: ClientModel): number {
        let total = this.getTotalTTC(this.produits.controls, this.prestations.controls);
        client.factures.forEach(
            facture => total += facture.totalTTC
        );
        return +(total / (client.factures.length + 1)).toFixed(2);
    }

    private enregisterFacture(mail: boolean) {
        const clientFormValue = this.clientForm.value;
        const produitsFormValue = this.produitsForm.value;
        const prestationsFormValue = this.prestationsForm.value;
        const remiseFormValue = this.remiseForm.value;
        const devisFormValue = this.devisForm.value;
        const totalHT = this.getTotalHT(this.produits.controls, this.prestations.controls);
        const totalTTC = this.getTotalTTC(this.produits.controls, this.prestations.controls);
        const tva21 = this.getTotalTva(this.produits.controls, this.prestations.controls, 2.1);
        const tva55 = this.getTotalTva(this.produits.controls, this.prestations.controls, 5.5);
        const tva10 = this.getTotalTva(this.produits.controls, this.prestations.controls, 10);
        const tva20 = this.getTotalTva(this.produits.controls, this.prestations.controls, 20);

        const facture: FactureModel = {
            date : new Date(),
            client : clientFormValue['client'],
            produitsFacture : produitsFormValue['produits'],
            prestationsFacture : prestationsFormValue['prestations'],
            totalHT : totalHT,
            totalTTC : totalTTC,
            tva21 : tva21,
            tva55 : tva55,
            tva10 : tva10,
            tva20 : tva20,
            remise: +remiseFormValue['remise'],
            idUser : this.userService.idUser,
            numero: this.numero,
            devis: devisFormValue['type'] === 'Devis' ? true : false
        };

        this.factureService.saveFacture(facture).subscribe(
            f => {
                this.facture = f;
                if (mail) {
                    this.factureService.sendMail(f.idFacture);
                }
                if (!f.devis) {
                    this.clientService.updatePanierMoyen(this.calculPanierMoyen(clientFormValue['client']), clientFormValue['client'].idClient).subscribe(
                        client => {
                            this.socket.modifClient(client);
                            this.clientService.replaceClient(client);
                        });
                    for (const control of this.produits.controls) {
                        this.factureService.saveProduitsFacture(control.value.quantite, f.idFacture, control.value.produit.idProduit);
                        this.produitService.diminuerQte(control.value.quantite, control.value.produit.idProduit);
                        this.produitService.ajoutFacture(control.value.quantite, f.idFacture, control.value.produit.idProduit);
                        this.checkStock(control.value.produit, control.value.quantite);
                    }
                    for (const control of this.prestations.controls) {
                        this.factureService.savePrestationsFacture(control.value.quantite, f.idFacture, control.value.prestation.id);
                    }
                } else {
                    for (const control of this.produits.controls) {
                        this.factureService.saveProduitsFacture(control.value.quantite, f.idFacture, control.value.produit.idProduit);
                    }
                    for (const control of this.prestations.controls) {
                        this.factureService.savePrestationsFacture(control.value.quantite, f.idFacture, control.value.prestation.id);
                    }
                }
                this.enregistree = true;
                this.showNext();
            }
        );
    }

    sansTva(produits: AbstractControl[], prestations: AbstractControl[]) {
        for (const control of produits) {
            if (control.value.produit.tva !== 0) {
                return false;
            }
        }
        for (const control of prestations) {
            if (control.value.prestation.tva !== 0) {
                return false;
            }
        }
        return true;
    }
}

import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, Inject} from '@angular/core';
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
import {OptionsService} from '../../options/options.service';


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
    clients: ClientModel[];
    listeProduits: ProduitModel[];
    messageQueue: string[] = [];
    subscriptions: Subscription[] = [];
    screenWidth: number;
    email: string;
    limiteStock: number;
    enCour: boolean;

    @ViewChild('facture') facture: ElementRef;

    constructor(private _formBuilder: FormBuilder, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
                private clientService: ClientsService, private produitService: ProduitService, private factureService: FactureService,
                private router: Router, private snackBar: MatSnackBar, private userService: UsersService,
                private notificationService: NotificationsService, private datePipe: DatePipe, private store: Store<UserState>,
                private optionService: OptionsService) {
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

        this.optionService.options$.subscribe(
            option => {
                if (option) {
                    this.limiteStock = option.limiteStock;
                }
            }
        );
    }

    get produits() {
        return this.produitsFormArray = this.produitsForm.get('produits') as FormArray;
    }

    ngOnInit() {
        this.initClients();
        this.initProduits();
        this.initForms();
        this.getScreenSize();
        this.enCour = false;
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

    /**
     * initialisation des formulaires
     */
    initForms() {
        this.clientForm = this._formBuilder.group({
            client: ['', Validators.required]
        });
        this.produitsForm = this._formBuilder.group({
            produits: this._formBuilder.array([this.createProduits()])
        });
    }

    /**
     * crée un nouveau formulaire de produit vide
     */
    private createProduits(): FormGroup {
        return this._formBuilder.group({
            produit: ['', CustomValidators.produitValidator()],
            quantite: ['', CustomValidators.quantiteeValidator()]
        });
    }

    /**
     * ajoute le formulaire de produit vide au formarray
     */
    addProduit(): void {
        this.produits.push(this.createProduits());
    }

    /**
     * envoi de la facture
     */
    onSubmit() {
        this.enCour = true;
        const clientFormValue = this.clientForm.value;
        const produitsFormValue = this.produitsForm.value;
        const total = this.getTotalHT(this.produits.controls);
        const facture = new FactureModel();
        facture.date = new Date();
        facture.client = clientFormValue['client'];
        facture.produitsFacture = produitsFormValue['produits'];
        facture.total = total;
        facture.idUser = this.userService.idUser;

        this.factureService.saveFacture(facture).pipe(
            finalize(() => this.enCour = false)
        ).subscribe(
            facture => {
                for (const control of this.produits.controls) {
                    this.factureService.saveProduitsFacture(control.value.quantite, facture.idFacture, control.value.produit.idProduit);
                    this.produitService.diminuerQte(control.value.quantite, control.value.produit.idProduit);
                    this.produitService.ajoutFacture(control.value.quantite, facture.idFacture, control.value.produit.idProduit);
                }
                this.factureService.sendMail(facture.idFacture);
                this.messageQueue.push('La facture a été envoyée par mail.');
                this.checkStock(this.listeProduits);
                this.showNext();
                this.router.navigate(['users/produits']);
            }
        );
    }

    /**
     * affiche la liste de produits pour l'auto completion
     * @param produit le produit dans l'input
     */
    displayFn(produit?: ProduitModel): string | undefined {
        return produit ? produit.designation : undefined;
    }

    /**
     * calcul le total de la facture
     * @param controls les inputs du formarray
     */
    getTotalHT(controls: AbstractControl[]): number {
        let total = 0;
        for (const control of controls) {
            total += (control.value.produit.prixVente * control.value.quantite);
        }
        return total;
    }

    /**
     * verifie les stocks et envoie des notifications en cas de stock bas
     * @param produits la liste de produits a verifier
     */
    checkStock(produits: ProduitModel[]) {
        produits.forEach(
            produit => {
                if (produit.quantite <= this.limiteStock && produit.quantite > 0) {
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
        );
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
     * supprimer un formulaire de produit du formarray
     * @param i l'indes du formarray a supprimer
     */
    supprimerProduit(i: number) {
        this.produits.removeAt(i);
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
            pdf.save(`facture-${this.clientForm.value.client.nom}-${this.clientForm.value.client.prenom}-${this.datePipe.transform(new Date(), 'dd/MM/yy')}.pdf`); // Generated PDF
        });
    }

    tvaExist(controls: AbstractControl[], tva: number): boolean {
        for (const control of controls) {
            if (control.value.produit.tva === tva) {
                return true;
            }
        }
        return false;
    }

    getTotalTva(controls: AbstractControl[], tva: number): number {
        let total = 0;
        for (const control of controls) {
            if (control.value.produit.tva === tva) {
                total += ((control.value.produit.prixVente * tva / 100) * control.value.quantite);
            }
        }
        return total;
    }

    getTotalTTC(controls: AbstractControl[]): number {
        let total = 0;
        for (const control of controls) {
            total += ((control.value.produit.prixVente + (control.value.produit.prixVente * control.value.produit.tva / 100)) * control.value.quantite);
        }
        return total;
    }
}

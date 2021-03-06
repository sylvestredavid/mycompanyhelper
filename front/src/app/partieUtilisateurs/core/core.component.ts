import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {GenreModel} from '../../models/genre.model';
import {GenreService} from '../genres/genre.service';
import {FournisseursService} from '../fournisseurs/fournisseurs.service';
import {Store} from '@ngrx/store';
import {UserState} from '../../shared/stores/user.reducer';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {OptionsComponent} from '../options/options.component';
import {DomSanitizer} from '@angular/platform-browser';
import {OptionsService} from '../options/options.service';
import {Router} from '@angular/router';
import {DeleteUser} from '../../shared/stores/user.actions';
import {AjoutGenreComponent} from '../genres/ajout-genre/ajout-genre.component';
import {Subscription} from 'rxjs';
import {NotificationsService} from '../notification/notifications.service';
import {NotificationComponent} from '../notification/notification.component';
import {MessageListComponent} from '../../shared/chatbot/message-list/message-list.component';
import {ProduitService} from '../produits/produit.service';
import {ClientsService} from '../clients/clients.service';
import {CalendrierService} from '../calendrier/calendrier.service';
import {SuiviDialComponent} from '../../shared/dialogues/suivi-dial/suivi-dial.component';
import {UsersService} from '../../users/users.service';
import {SuiviConsommationModel} from '../../models/suivi-consommation.model';
import {EntrepriseService} from '../entreprise/entreprise.service';
import {AchatService} from '../achat/achat.service';
import {CaService} from '../ca/ca.service';
import {PrestationsService} from '../prestations/prestations.service';
import {SocketService} from '../../shared/socket.service';

@Component({
    selector: 'app-core',
    templateUrl: './core.component.html',
    styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit, OnDestroy {
    genres: GenreModel[];
    role: String;
    entreprise: string;
    panelClass;
    subscriptions: Subscription[] = [];
    nbNotifications: number;
    screenWidth: number;
    suivi: SuiviConsommationModel;

    constructor(private fournisseurService: FournisseursService, private genreService: GenreService, private store: Store<UserState>
        , public dialog: MatDialog, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private produitService: ProduitService,
                private clientService: ClientsService, private optionService: OptionsService, private router: Router, private calendrierService: CalendrierService,
                private notificationService: NotificationsService, private userService: UsersService, private entrepriseService: EntrepriseService,
                private achatService: AchatService, private caService: CaService, private prestationService: PrestationsService,
                private socket: SocketService) {
        iconRegistry.addSvgIcon(
            'quit',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/sortie.svg'));
        iconRegistry.addSvgIcon(
            'notification',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/notification.svg'));
        iconRegistry.addSvgIcon(
            'suivi',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/suivi.svg'));
        iconRegistry.addSvgIcon(
            'aide',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/aide.svg'));
    }

    ngOnInit() {
        this.optionService.publishOptions();
        this.caService.publishCAPrevisionnel();
        this.produitService.publishProduits();
        this.prestationService.publishPrestations();
        this.achatService.publishAchats();
        this.clientService.publishClients();
        this.entrepriseService.publishEntreprise();
        this.calendrierService.publishCalendrier();
        this.genreService.publishGenres();
        this.fournisseurService.publishFournisseurs();
        this.initNotifications();
        this.store.select('user').subscribe(
            user => {
                if (user) {
                    this.role = user[0].authorities;
                }
            }
        );
        // this.userService.suiviUtilisation().subscribe(
        //     s => {
        //         this.suivi = s;
        //     }
        // );
        this.initGenres();
        this.getScreenSize();
        this.initSocket();
    }

    initSocket() {
        this.socket.getAjoutGenre().subscribe(
            (data) => {
                if (data.idUser === this.userService.idUser) {
                    this.genreService.pushGenre(data.genre);
                }
            }
        );
        this.socket.getDeleteGenre().subscribe(
            (data) => {
                if (data.idUser === this.userService.idUser) {
                    this.genreService.removeGenre(data.id);
                }
            }
        );
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
        this.socket.getAjoutCalendrier().subscribe(
            data => {
                if (data.idUser === this.userService.idUser) {
                    this.calendrierService.pushCalendrier(data.calendrier);
                }
            }
        );
        this.socket.getModifCalendrier().subscribe(
            data => {
                if (data.idUser === this.userService.idUser) {
                    this.calendrierService.updateCalendrier(data.calendrier);
                }
            }
        );
        this.socket.getDeleteCalendrier().subscribe(
            data => {
                if (data.idUser === this.userService.idUser) {
                    this.calendrierService.removeCalendrier(data.id);
                }
            }
        );
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
        this.socket.getAjoutPrestation().subscribe(
            data => {
                if (data.idUser === this.userService.idUser) {
                    this.prestationService.pushPrestation(data.prestation);
                }
            }
        );
        this.socket.getModifPrestation().subscribe(
            data => {
                if (data.idUser === this.userService.idUser) {
                    this.prestationService.replacePrestation(data.prestation);
                }
            }
        );
        this.socket.getDeletePrestation().subscribe(
            data => {
                if (data.idUser === this.userService.idUser) {
                    this.prestationService.removePrestation(data.prestation);
                }
            }
        );
    }

    /**
     * recuperation des notifications
     */
    initNotifications() {
        this.notificationService.publishNotifications();
        this.subscriptions.push(this.notificationService.listeNotifications$.subscribe(notifications => {
            if (notifications) {
                this.nbNotifications = 0;
                notifications.forEach(
                    notification => {
                        if (!notification.vue) {
                            this.nbNotifications++;
                        }
                    }
                );
            }
        }));
    }

    /**
     * recuperation des genres
     */
    initGenres() {
        this.subscriptions.push(this.genreService.listeGenre$.subscribe(
            genres => this.genres = genres
        ));
    }

    /**
     * ouverture de la lightbox des options
     */
    openOptions(): void {
        this.dialog.open(OptionsComponent, {width: '40%', minWidth: '300px', maxWidth: '700px', panelClass: this.panelClass});
    }

    /**
     * deconnexion
     */
    sortie() {
        sessionStorage.removeItem('token');
        localStorage.removeItem('token');
        this.store.dispatch(new DeleteUser());
        window.location.replace('');
    }

    /**
     * ouverture de la lightbox d'ajout de genre
     */
    ajoutCat() {
        this.dialog.open(AjoutGenreComponent, {panelClass: this.panelClass});
    }

    ngOnDestroy(): void {
        if (this.subscriptions.length > 0) {
            this.subscriptions.forEach(subscription => subscription.unsubscribe());
        }
    }

    /**
     * ouverture de la lightbox des notifications
     */
    openNotifications(): void {
        this.dialog.open(NotificationComponent, {width: '40%', minWidth: '300px', maxWidth: '700px', panelClass: this.panelClass});
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenWidth = window.innerWidth;
    }

    openChatBot() {
        this.dialog.open(MessageListComponent);
    }
    openSuivi() {
        this.dialog.open(SuiviDialComponent, {data: {suivi: this.suivi}});
    }
}

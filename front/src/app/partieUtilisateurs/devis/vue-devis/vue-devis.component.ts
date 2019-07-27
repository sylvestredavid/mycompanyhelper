import {Component, OnInit} from '@angular/core';
import {DevisService} from '../devis.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FactureModel} from '../../../models/facture.model';
import {DatePipe} from '@angular/common';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {EntrepriseModel} from '../../../models/entreprise.model';
import {EntrepriseService} from '../../entreprise/entreprise.service';
import {FactureService} from '../../factures/facture.service';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material';
import {ClientsService} from '../../clients/clients.service';
import {ClientModel} from '../../../models/client.model';
import {ProduitModel} from '../../../models/produit.model';
import {NotificationModel} from '../../../models/notification.model';
import {ProduitService} from '../../produits/produit.service';
import {UsersService} from '../../../users/users.service';
import {NotificationsService} from '../../notification/notifications.service';
import {Store} from '@ngrx/store';
import {UserState} from '../../../shared/stores/user.reducer';

@Component({
  selector: 'app-vue-devis',
  templateUrl: './vue-devis.component.html',
  styleUrls: ['./vue-devis.component.scss']
})
export class VueDevisComponent implements OnInit {

  private snackBarRef: MatSnackBarRef<SimpleSnackBar>;
  devis: FactureModel;
  entreprise: EntrepriseModel;
  email: string;
  messageQueue: string[] = [];

  constructor(private devisService: DevisService, private datePipe: DatePipe, private route: ActivatedRoute,
              private entrepriseService: EntrepriseService, private factureService: FactureService, private snackBar: MatSnackBar,
              private clientService: ClientsService, private produitService: ProduitService, private notificationService: NotificationsService,
              private userService: UsersService, private router: Router, private store: Store<UserState>) {
    this.store.select('user').subscribe(
        user => {
          if (user) {
            this.email = user[0].username;
          }
        }
    );
  }

  ngOnInit() {
    this.entrepriseService.entreprise$.subscribe(
        e => this.entreprise = e
    );
    this.devisService.findFacture(this.route.snapshot.params.id).subscribe(
        devis => {
          this.devis = devis;
          console.log(this.devis)
        }
    );
  }

  generatePDF(id: string) {
    const data = document.getElementById(id);
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
      pdf.save(`devis-${this.devis.client.nom}-${this.devis.client.prenom}-${this.datePipe.transform(new Date(), 'dd/MM/yy')}.pdf`); // Generated PDF
    });
  }

  onEnvoyer() {
    this.factureService.sendMail(this.devis.idFacture);
   this.snackBar.open('le devis à bien été renvoyé.', 'ok');
  }

  onAccepter() {
    this.devis.devis = false;
    this.factureService.saveFacture(this.devis).subscribe(
      f => {
        this.factureService.sendMail(f.idFacture);
          this.clientService.updatePanierMoyen(this.calculPanierMoyen(this.devis.client), this.devis.client.idClient).subscribe(
              client => {
                // this.socket.modifClient(client);
                this.clientService.replaceClient(client);
              });
          this.messageQueue.push('La facture a été envoyée par mail.');
          if (this.devis.produitsFacture && this.devis.produitsFacture.length > 0) {
            for (const produit of this.devis.produitsFacture) {
              this.produitService.diminuerQte(produit.quantite, produit.produit.idProduit);
              this.produitService.ajoutFacture(produit.quantite, f.idFacture, produit.produit.idProduit);
              this.checkStock(produit.produit, produit.quantite);
            }
          }
        this.showNext();
        this.router.navigate(['users/devis']);
      }
  );
  }

  calculPanierMoyen(client: ClientModel): number {
    let total = this.devis.totalTTC;
    client.factures.forEach(
        facture => total += facture.totalTTC
    );
    return +(total / (client.factures.length + 1)).toFixed(2);
  }

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
}

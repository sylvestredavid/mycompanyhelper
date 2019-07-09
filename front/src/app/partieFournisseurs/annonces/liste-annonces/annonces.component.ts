import {Component, OnDestroy, OnInit} from '@angular/core';
import {AnnonceModel} from '../../../models/annonce.model';
import {AnnonceService} from '../annonce.service';
import {Subscription} from 'rxjs';
import {SocketService} from '../../../shared/socket.service';
import {MatDialog, MatIconRegistry, MatSnackBar} from '@angular/material';
import {ChekoutDialComponent} from './chekout-dial/chekout-dial.component';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'app-annonces',
    templateUrl: './annonces.component.html',
    styleUrls: ['./annonces.component.scss']
})
export class AnnoncesComponent implements OnInit, OnDestroy {

    listeAnnonces: AnnonceModel[];
    subscription: Subscription;

    constructor(private annonceService: AnnonceService, private socket: SocketService, public dialog: MatDialog,
                private snackBar: MatSnackBar, iconRegistry: MatIconRegistry,
                sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon(
            'delete',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/delete.svg'));
    }

    ngOnInit() {
        this.annonceService.publishAnnonces();
        this.subscription = this.annonceService.listeAnnonces$.subscribe(
            annonces => this.listeAnnonces = annonces
        );
    }

    /**
     * supression d'une annonce
     * @param id identifiant de l'annonce
     */
    onDelete(annonce: AnnonceModel) {
        this.annonceService.delete(annonce.id);
        this.annonceService.deleteFile(annonce.image);
        this.socket.deleteAnnonce(annonce.id);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    openCheckoutDial(idAnnonce: number, titre: string) {
        const dialogRef = this.dialog.open(ChekoutDialComponent, {width: '500px', data: {idAnnonce: idAnnonce, titre: titre}});

        dialogRef.afterClosed().subscribe(result => {
            if(result) {
                this.snackBar.open(result, 'ok', {verticalPosition: 'top', duration: 2500});
            }
        });
    }
}

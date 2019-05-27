import {Component, Inject, OnInit} from '@angular/core';
import {AnnonceService} from '../../annonce.service';
import {MAT_DIALOG_DATA, MatDialogRef, MatIconRegistry, MatSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {finalize} from 'rxjs/operators';
import {BehaviorSubject} from "rxjs";

interface DialogData {
    idAnnonce: number;
    resultat: string;
    titre: string;
}

@Component({
    selector: 'app-chekout-dial',
    templateUrl: './chekout-dial.component.html',
    styleUrls: ['./chekout-dial.component.scss']
})
export class ChekoutDialComponent implements OnInit {

    annee: number;
    anneeListe: number[] = [];
    checkoutForm: FormGroup;
    enCours$ = new BehaviorSubject<boolean>(false);
    msg: string

    constructor(private annonceService: AnnonceService, public dialogRef: MatDialogRef<ChekoutDialComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder, iconRegistry: MatIconRegistry,
                sanitizer: DomSanitizer, private snackBar: MatSnackBar) {
        iconRegistry.addSvgIcon(
            'sortie',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/delete.svg'));
    }

    ngOnInit() {
        this.annee = new Date().getFullYear();
        for (let i = this.annee; i < this.annee + 50; i++) {
            this.anneeListe.push(i);
        }
        this.checkoutForm = this.fb.group({
            numeroCarte: ['', Validators.required],
            moisExpiration: ['01'],
            anneeExpiration: [this.annee],
            CVC: ['', Validators.required]
        });
    }

    chargeCreditCard() {
        this.enCours$.next(true);
        const form = this.checkoutForm.value;
        (<any>window).Stripe.card.createToken({
            number: form.numeroCarte.replace(/( )/g, ''),
            exp_month: form.moisExpiration,
            exp_year: form.anneeExpiration,
            cvc: form.CVC
        }, (status: number, response: any) => {
            if (status === 200) {
                let token = response.id;
                this.chargeCard(token);
            }
            if (status === 402) {
                this.enCours$.next(false)
                this.msg = 'Numero de carte incorrect';
                this.snackBar.open(this.msg, 'ok', {verticalPosition: 'top', duration: 2500});
                document.getElementById('encours').click();
            }
        });
    }

    chargeCard(token: string) {
        this.annonceService.miseEnAvant(token, this.data.idAnnonce).pipe(
            finalize(() => this.enCours$.next(false))
        ).subscribe(
            (ok: any) => {
                this.annonceService.mettreAnnonceEnAvant(this.data.idAnnonce);
                this.dialogRef.close(`L'annonce ${this.data.titre} est mise en avant.`);
                document.getElementById('encours').click();
            },
            err => {
                this.msg = 'Le paiement n\'a pas été accepté';
                this.snackBar.open(this.msg, 'ok', {verticalPosition: 'top', duration: 2500});
                document.getElementById('encours').click();
            }
        );
    }

    close() {
        this.dialogRef.close();
    }
}

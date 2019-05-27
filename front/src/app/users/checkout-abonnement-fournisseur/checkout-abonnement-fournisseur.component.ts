import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UsersService} from '../../users/users.service';
import {MAT_DIALOG_DATA, MatDialogRef, MatIconRegistry, MatSnackBar} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {SignUpModel} from '../../models/signUp.model';
import {finalize} from 'rxjs/operators';
import {AjoutUser} from "../../shared/stores/user.actions";
import {UserState} from "../../shared/stores/user.reducer";
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";

interface DialogData {
    signupRequest: SignUpModel
}

@Component({
    selector: 'app-chekout-abonnement',
    templateUrl: './checkout-abonnement-fournisseur.component.html',
    styleUrls: ['./checkout-abonnement-fournisseur.component.scss']
})
export class CheckoutAbonnementFournisseurComponent implements OnInit {

    annee: number;
    anneeListe: number[] = [];
    checkoutForm: FormGroup;
    msg: string;
    enCours$ = new BehaviorSubject<boolean>(false);

    constructor(private userService: UsersService, public dialogRef: MatDialogRef<CheckoutAbonnementFournisseurComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder, iconRegistry: MatIconRegistry,
                sanitizer: DomSanitizer, private snackBar: MatSnackBar, private store: Store<UserState>, private router: Router) {
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
        this.userService.abonnementFournisseur(token, this.data.signupRequest.username).pipe(
            finalize(() => this.enCours$.next(false))
        ).subscribe(
            (reponse: any) => {
                this.userService.signup(this.data.signupRequest).subscribe(
                    user => {
                        this.userService.addAbonnement(reponse.msg, user.username);
                        this.userService.idUser = user.managementId !== null ? user.managementId : user.id;
                        this.store.dispatch(new AjoutUser(user));
                        sessionStorage.setItem('token', user.token);
                        this.dialogRef.close('ok');
                        document.getElementById('encours').click();
                    }
                );
            },
            err => {
                this.msg = 'Le paiement n\'a pas été accepté';
                this.snackBar.open(this.msg, 'ok', {verticalPosition: 'top', duration: 2500});
                document.getElementById('encours').click();
            }
        );
    }

    close() {
        this.dialogRef.close(this.msg);
    }
}

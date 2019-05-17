import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UsersService} from '../users.service';
import {MAT_DIALOG_DATA, MatDialogRef, MatIconRegistry, MatSnackBar} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {SignUpModel} from '../../models/signUp.model';
import {finalize} from 'rxjs/operators';

interface DialogData {
    signupRequest: SignUpModel;
    typeAbo: string;
}

@Component({
    selector: 'app-chekout-abonnement',
    templateUrl: './checkout-abonnement.component.html',
    styleUrls: ['./checkout-abonnement.component.scss']
})
export class CheckoutAbonnementComponent implements OnInit {

    annee: number;
    anneeListe: number[] = [];
    checkoutForm: FormGroup;
    msg: string;
    enCours: boolean;

    constructor(private userService: UsersService, public dialogRef: MatDialogRef<CheckoutAbonnementComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder, iconRegistry: MatIconRegistry,
                sanitizer: DomSanitizer, private snackBar: MatSnackBar) {
        iconRegistry.addSvgIcon(
            'sortie',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/delete.svg'));
    }

    ngOnInit() {
        this.enCours = false;
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
        this.enCours = true;
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
        });
    }

    chargeCard(token: string) {
        if (this.data.typeAbo === 'fixe') {
            this.userService.abonnement(token, this.data.signupRequest.username).pipe(
                finalize(() => this.enCours = false)
            ).subscribe(
                (reponse: any) => {
                    this.userService.signup(this.data.signupRequest).subscribe(
                        user => {
                            if (user) {
                                this.userService.addAbonnement(reponse.msg, user.username);
                                this.msg = 'Votre inscription a été effectuée, vous pouvez vous connecter.';
                                this.dialogRef.close(this.msg);
                            }
                        }
                    );
                },
                err => {
                    this.msg = 'Le paiement n\'a pas été accepté';
                    this.snackBar.open(this.msg, 'ok', {verticalPosition: 'top', duration: 2500});
                }
            );
        } else {
            this.userService.abonnementRequete(token, this.data.signupRequest.username).subscribe(
                (reponse: any) => {
                    this.userService.signup(this.data.signupRequest).subscribe(
                        user => {
                            if (user) {
                                this.userService.addAbonnement(reponse.msg, user.username);
                                this.msg = 'Votre inscription a été effectuée, vous pouvez vous connecter.';
                                this.dialogRef.close(this.msg);
                            }
                        }
                    );
                },
                err => {
                    this.msg = 'Le paiement n\'a pas été accepté';
                    this.snackBar.open(this.msg, 'ok', {verticalPosition: 'top', duration: 2500});
                }
            );
        }
    }

    close() {
        this.dialogRef.close(this.msg);
    }
}

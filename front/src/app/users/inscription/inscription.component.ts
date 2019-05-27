import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UsersService} from '../users.service';
import {SignUpModel} from '../../models/signUp.model';
import {MatDialog, MatIconRegistry, MatSnackBar} from '@angular/material';
import {CustomValidators} from '../../shared/validators/custom.validator';
import {MdpUtils} from '../../shared/utils/mdp-utils';
import {Router} from '@angular/router';
import {CheckoutAbonnementComponent} from '../checkout-abonnement/checkout-abonnement.component';
import {DomSanitizer} from '@angular/platform-browser';
import {CheckoutAbonnementFournisseurComponent} from '../checkout-abonnement-fournisseur/checkout-abonnement-fournisseur.component';

@Component({
    selector: 'app-inscription',
    templateUrl: './inscription.component.html',
    styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit {

    signUpForm: FormGroup;

    regex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/g;

    msg: string;

    hideMdp1: boolean;

    hideMdp2: boolean;

    usernameList: string[];

    constructor(private userService: UsersService, private snackBar: MatSnackBar, private fb: FormBuilder,
                public mdpUtils: MdpUtils, private router: Router, public dialog: MatDialog, iconRegistry: MatIconRegistry,
                sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon(
            'hide',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/hide.svg'));
        iconRegistry.addSvgIcon(
            'nohide',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/nohide.svg'));
    }

    ngOnInit() {
        this.userService.findAllUsername().subscribe(
            username => {
                this.usernameList = username;
                this.initForm();
            }
        );
        this.hideMdp1 = this.hideMdp2 = true;
    }

    /**
     * envoi du formulaire
     */
    onSubmit() {
        const signUp: SignUpModel = {
            name: this.signUpForm.value.name,
            username: this.signUpForm.value.username,
            entreprise: this.signUpForm.value.entreprise,
            password: this.signUpForm.value.password1,
            role: this.signUpForm.value.typeInscription === 'user' ? ['admin'] : ['fournisseur']
        };
        if (this.signUpForm.value.typeInscription === 'user') {
            const dialogRef = this.dialog.open(CheckoutAbonnementComponent, {
                width: '500px',
                data: {signupRequest: signUp, typeAbo: this.signUpForm.value.typeAbo}
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    if (result === 'ok') {
                        this.router.navigate(['users']);
                    } else {
                        // this.snackBar.open(result, 'ok', {verticalPosition: 'top', duration: 2500});
                        // this.signUpForm.reset()
                    }
                }
            });
        } else if (this.signUpForm.value.typeInscription === 'fournisseur') {
            const dialogRef = this.dialog.open(CheckoutAbonnementFournisseurComponent, {
                width: '500px',
                data: {signupRequest: signUp}
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    if (result === 'ok') {
                    this.router.navigate(['fournisseurs']);
                } else {
                    // this.snackBar.open(result, 'ok', {verticalPosition: 'top', duration: 2500});
                    // this.signUpForm.reset()
                }
                }
            });
        }
    }

    /**
     * initialisation du formulaire
     */
    private initForm() {
        this.signUpForm = this.fb.group({
            name: ['', Validators.required],
            username: ['', Validators.compose([Validators.required, Validators.email, CustomValidators.usernameValidator(this.usernameList)])],
            entreprise: ['', Validators.required],
            password1: ['', Validators.compose([Validators.required, Validators.pattern(this.regex)])],
            password2: ['', Validators.compose(
                [Validators.required, CustomValidators.passwordMatchValidator()])],
            typeAbo: 'fixe',
            typeInscription: ['', Validators.required],

        });
    }
}

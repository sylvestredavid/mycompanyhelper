import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConnexionComponent} from './connexion/connexion.component';
import {RouterModule} from '@angular/router';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSnackBarModule,
    MatToolbarModule
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {PasswordStrengthMeterModule} from 'angular-password-strength-meter';
import {LightboxMailComponent} from './connexion/lightbox-mail/lightbox-mail.component';
import {InscriptionComponent} from './inscription/inscription.component';
import {IsConnectedGuard} from '../shared/guards/is-connected-guard.service';
import {CheckoutAbonnementComponent} from './checkout-abonnement/checkout-abonnement.component';
import {SharedModule} from '../shared/shared.module';
import {CheckoutAbonnementFournisseurComponent} from './checkout-abonnement-fournisseur/checkout-abonnement-fournisseur.component';


@NgModule({
    entryComponents: [LightboxMailComponent, CheckoutAbonnementComponent, CheckoutAbonnementFournisseurComponent],
    declarations: [
        ConnexionComponent,
        ChangePasswordComponent,
        LightboxMailComponent,
        InscriptionComponent,
        CheckoutAbonnementComponent,
        CheckoutAbonnementFournisseurComponent,
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        HttpClientModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        SharedModule,
        MatCheckboxModule,
        MatDialogModule,
        MatToolbarModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatRadioModule,
        ReactiveFormsModule,
        FormsModule,
        PasswordStrengthMeterModule,
        RouterModule.forChild([
            {path: '', component: ConnexionComponent, canActivate: [IsConnectedGuard]},
            {path: 'changePassword', component: ChangePasswordComponent},
            {path: 'changePassword/:email', component: ChangePasswordComponent}
        ])
    ],
    exports: [
        ConnexionComponent,
        InscriptionComponent
    ]
})
export class UsersModule {
}

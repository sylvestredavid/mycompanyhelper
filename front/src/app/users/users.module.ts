import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConnexionComponent} from './connexion/connexion.component';
import {RouterModule} from '@angular/router';
import {
    MatAutocompleteModule,
    MatButtonModule, MatCheckboxModule, MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule, MatMenuModule,
    MatPaginatorModule, MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule, MatToolbarModule
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {PasswordStrengthMeterModule} from 'angular-password-strength-meter';
import {LightboxMailComponent} from './connexion/lightbox-mail/lightbox-mail.component';
import {InscriptionComponent} from './inscription/inscription.component';
import {IsConnectedGuard} from '../shared/guards/is-connected-guard.service';
import { CheckoutAbonnementComponent } from './checkout-abonnement/checkout-abonnement.component';
import {CardNumberPipe} from '../shared/pipes/card-number.pipe';
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
        MatProgressSpinnerModule,
        MatTableModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatIconModule,
        SharedModule,
        MatCheckboxModule,
        MatStepperModule,
        MatDialogModule,
        MatToolbarModule,
        MatMenuModule,
        ScrollingModule,
        MatSnackBarModule,
        MatPaginatorModule,
        MatRadioModule,
        ReactiveFormsModule,
        FormsModule,
        MatProgressBarModule,
        PasswordStrengthMeterModule,
        RouterModule.forChild([
            {path: '', component: ConnexionComponent, canActivate: [IsConnectedGuard]},
            {path: 'changePassword', component: ChangePasswordComponent},
            {path: 'changePassword/:email', component: ChangePasswordComponent}
        ])
    ],
    exports: [
        ConnexionComponent
    ]
})
export class UsersModule {
}

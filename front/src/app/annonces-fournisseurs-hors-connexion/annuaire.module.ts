import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {
    MatAutocompleteModule,
    MatButtonModule, MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule, MatMenuModule,
    MatPaginatorModule, MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule, MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule, MatToolbarModule
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PasswordStrengthMeterModule} from 'angular-password-strength-meter';
import { ListeAnnoncesHorsConnexionComponent } from './liste-annonces/liste-annonces-hors-connexion.component';
import { DetailAnnonceHorsConnexionComponent } from './detail-annonce/detail-annonce-hors-connexion.component';



@NgModule({
    entryComponents: [],
    declarations: [
    ListeAnnoncesHorsConnexionComponent,
    DetailAnnonceHorsConnexionComponent,
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
        MatStepperModule,
        MatDialogModule,
        ScrollingModule,
        MatSnackBarModule,
        MatPaginatorModule,
        MatRadioModule,
        ReactiveFormsModule,
        MatMenuModule,
        MatToolbarModule,
        MatSliderModule,
        FormsModule,
        MatProgressBarModule,
        PasswordStrengthMeterModule,
        RouterModule.forChild([
            {path: '', component: ListeAnnoncesHorsConnexionComponent},
            {path: 'detail/:id', component: DetailAnnonceHorsConnexionComponent}
         ])
    ],
    exports: [

    ]
})
export class AnnuaireModule { }

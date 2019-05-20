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
import { ListeAnnoncesComponent } from './liste-annonces/liste-annonces.component';
import { DetailAnnonceComponent } from './detail-annonce/detail-annonce.component';
import {AuthGuard} from '../../shared/guards/auth-guard.service';



@NgModule({
    entryComponents: [],
    declarations: [
    ListeAnnoncesComponent,
    DetailAnnonceComponent,
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        HttpClientModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
        MatToolbarModule,
        ReactiveFormsModule,
        MatSliderModule,
        FormsModule,
        RouterModule.forChild([
            {path: '', component: ListeAnnoncesComponent, canActivate: [AuthGuard]},
            {path: 'detail/:id', component: DetailAnnonceComponent, canActivate: [AuthGuard]},
         ])
    ],
    exports: [

    ]
})
export class AnnuaireModule { }

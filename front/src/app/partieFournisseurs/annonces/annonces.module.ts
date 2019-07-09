import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AnnoncesComponent} from './liste-annonces/annonces.component';
import {FournisseurGuard} from '../../shared/guards/fournisseur-guard.service';
import {CreerAnnonceComponent} from './creer-annonce/creer-annonce.component';
import {ModifAnnonceComponent} from './modif-annonce/modif-annonce.component';
import {ChekoutDialComponent} from './liste-annonces/chekout-dial/chekout-dial.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
    entryComponents: [ChekoutDialComponent],
    declarations: [
        AnnoncesComponent,
        CreerAnnonceComponent,
        ModifAnnonceComponent,
        ChekoutDialComponent,
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        HttpClientModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        SharedModule,
        MatInputModule,
        MatIconModule,
        MatDialogModule,
        ScrollingModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forChild([
            {path: '', canActivate: [FournisseurGuard], component: AnnoncesComponent},
            {path: 'creer', canActivate: [FournisseurGuard], component: CreerAnnonceComponent},
            {path: 'modif-annonce/:id', canActivate: [FournisseurGuard], component: ModifAnnonceComponent}
        ])
    ],
    exports: [

    ]
})
export class AnnoncesModule { }

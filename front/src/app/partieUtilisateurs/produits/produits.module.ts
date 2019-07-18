import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProduitsComponent} from './listes-produits/produits.component';
import {RouterModule} from '@angular/router';
import {
  MatButtonModule, MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatSnackBarModule
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthGuard} from '../../shared/guards/auth-guard.service';
import {SharedModule} from '../../shared/shared.module';
import {ProduitsHorsVenteComponent} from './produits-hors-vente/produits-hors-vente.component';
import {ProduitsFormGuard} from '../../shared/guards/produits-form-guard.service';

@NgModule({
  declarations: [
    ProduitsComponent,
    ProduitsHorsVenteComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatCheckboxModule,
    MatButtonModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    ScrollingModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      {path: '', canActivate: [AuthGuard], component: ProduitsComponent, canDeactivate: [ProduitsFormGuard]},
      {path: 'categorie/:designation', canActivate: [AuthGuard], component: ProduitsComponent},
      {path: 'produits-supprimes', canActivate: [AuthGuard], component: ProduitsHorsVenteComponent},
    ])
  ],
  exports: [
    ProduitsComponent,
  ]
})
export class ProduitsModule { }

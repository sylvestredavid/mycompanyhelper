import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {CreateFactureComponent} from './create-facture/create-facture.component';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthGuard} from '../../shared/guards/auth-guard.service';
import {FournisseurGuard} from '../../shared/guards/fournisseur-guard.service';
import {IsConnectedGuard} from '../../shared/guards/is-connected-guard.service';

@NgModule({
  declarations: [
    CreateFactureComponent,
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
    ScrollingModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatRadioModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      {path: '', canActivate: [AuthGuard], component: CreateFactureComponent}
    ])
  ],
  exports: [
    CreateFactureComponent,
  ]
})
export class FacturesModule { }

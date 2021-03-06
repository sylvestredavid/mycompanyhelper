import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {CreateFactureComponent} from './create-facture/create-facture.component';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule, MatRadioModule,
    MatSelectModule,
    MatSnackBarModule,
    MatStepperModule
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthGuard} from '../../shared/guards/auth-guard.service';

@NgModule({
  declarations: [
    CreateFactureComponent,
  ],
    imports: [
        CommonModule,
        MatButtonModule,
        HttpClientModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatIconModule,
        MatStepperModule,
        ScrollingModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forChild([
            {path: '', canActivate: [AuthGuard], component: CreateFactureComponent}
        ]),
        MatRadioModule
    ],
  exports: [
    CreateFactureComponent,
  ]
})
export class FacturesModule { }

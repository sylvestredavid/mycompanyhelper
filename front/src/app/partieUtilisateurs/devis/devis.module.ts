import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DevisComponent} from './devis/devis.component';
import {RouterModule} from '@angular/router';
import {AuthGuard} from '../../shared/guards/auth-guard.service';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatTableModule
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import { VueDevisComponent } from './vue-devis/vue-devis.component';

@NgModule({
  declarations: [DevisComponent, VueDevisComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatCheckboxModule,
        HttpClientModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        ScrollingModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        RouterModule.forChild([
            {path: '', canActivate: [AuthGuard], component: DevisComponent},
            {path: ':id', canActivate: [AuthGuard], component: VueDevisComponent}
        ]),
        MatTableModule,
    ]
})
export class DevisModule { }

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FournisseursListeComponent} from './fournisseurs-liste/fournisseurs-liste.component';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AuthGuard} from '../../shared/guards/auth-guard.service';
import {SharedModule} from '../../shared/shared.module';
import {DialogFournisseursComponent} from './fournisseurs-liste/dialog-fournisseurs/dialog-fournisseurs.component';
import {FournisseursFormGuard} from '../../shared/guards/fournisseurs-form-guard.service';
import {MailingComponent} from "../mailing/mailing/mailing.component";

@NgModule({
    entryComponents: [DialogFournisseursComponent],
    declarations: [
        FournisseursListeComponent,
        DialogFournisseursComponent,
    ],
    exports: [FournisseursListeComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        HttpClientModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatIconModule,
        ScrollingModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        MatCheckboxModule,
        RouterModule.forChild([
            {
                path: '',
                canActivate: [AuthGuard],
                component: FournisseursListeComponent,
                canDeactivate: [FournisseursFormGuard]
            },
        ]),
    ]
})
export class FournisseursModule {
}

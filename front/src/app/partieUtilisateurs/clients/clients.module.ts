import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ClientsComponent} from './liste-clients/clients.component';
import {ClientDetailComponent} from './client-detail/client-detail.component';
import {ClientFacturesComponent} from './client-factures/client-factures.component';
import {
    MatButtonModule, MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatTableModule,
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthGuard} from '../../shared/guards/auth-guard.service';
import {SharedModule} from '../../shared/shared.module';
import {ClientsFormGuard} from '../../shared/guards/clients-form-guard.service';
import {MailingComponent} from "../mailing/mailing/mailing.component";

@NgModule({
    declarations: [
        ClientsComponent,
        ClientDetailComponent,
        ClientFacturesComponent
    ],
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
            {path: '', canActivate: [AuthGuard], component: ClientsComponent, canDeactivate: [ClientsFormGuard]},
            {path: 'detailClient/:id', canActivate: [AuthGuard], component: ClientDetailComponent},
        ])
    ],
    exports: [
        ClientsComponent,
        ClientDetailComponent,
        ClientFacturesComponent
    ]
})
export class ClientsModule {
}

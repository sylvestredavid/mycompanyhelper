import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PrestationsComponent} from './prestations/prestations.component';
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

@NgModule({
    entryComponents: [],
    declarations: [
        PrestationsComponent
    ],
    exports: [PrestationsComponent],
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
                component: PrestationsComponent
            },
        ]),
    ]
})
export class PrestationsModule {
}

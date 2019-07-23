import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AchatComponent} from './achat/achat.component';
import {RouterModule} from '@angular/router';
import {AdminGuard} from '../../shared/guards/admin-guard.service';
import {SharedModule} from '../../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule
} from '@angular/material';
import { AchatDialComponent } from './achat/achat-dial/achat-dial.component';

@NgModule({
    entryComponents: [AchatDialComponent],
    declarations: [AchatComponent, AchatDialComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {path: '', canActivate: [AdminGuard], component: AchatComponent},
        ]),
        SharedModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
    ]
})
export class AchatModule { }

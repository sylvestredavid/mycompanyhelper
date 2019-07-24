import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CaPrevisionnelComponent} from './ca-previsionnel/ca-previsionnel.component';
import {RouterModule} from '@angular/router';
import {AdminGuard} from '../../shared/guards/admin-guard.service';
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule, MatFormFieldModule, MatInputModule} from "@angular/material";

@NgModule({
  declarations: [CaPrevisionnelComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                canActivate: [AdminGuard],
                component: CaPrevisionnelComponent
            },
        ]),
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
    ]
})
export class CaModule { }

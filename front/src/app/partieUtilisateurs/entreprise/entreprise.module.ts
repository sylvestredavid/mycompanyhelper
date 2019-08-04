import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EntrepriseComponent} from './entreprise/entreprise.component';
import {RouterModule} from "@angular/router";
import {AuthGuard} from "../../shared/guards/auth-guard.service";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule, MatCheckboxModule, MatInputModule} from "@angular/material";
import {AdminGuard} from "../../shared/guards/admin-guard.service";

@NgModule({
  declarations: [EntrepriseComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatInputModule,
        RouterModule.forChild([
            {path: '', canActivate: [AdminGuard], component: EntrepriseComponent},
        ]),
        ReactiveFormsModule,
        MatCheckboxModule
    ]
})
export class EntrepriseModule { }

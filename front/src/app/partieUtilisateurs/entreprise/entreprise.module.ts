import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntrepriseComponent } from './entreprise/entreprise.component';
import {RouterModule} from "@angular/router";
import {AdminGuard} from "../../shared/guards/admin-guard.service";
import {AuthGuard} from "../../shared/guards/auth-guard.service";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule, MatInputModule} from "@angular/material";

@NgModule({
  declarations: [EntrepriseComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatInputModule,
        RouterModule.forChild([
            {path: '', canActivate: [AuthGuard], component: EntrepriseComponent},
        ]),
        ReactiveFormsModule
    ]
})
export class EntrepriseModule { }

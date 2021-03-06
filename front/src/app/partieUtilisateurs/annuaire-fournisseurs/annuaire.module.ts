import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatSliderModule,
    MatToolbarModule
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ListeAnnoncesComponent} from './liste-annonces/liste-annonces.component';
import {DetailAnnonceComponent} from './detail-annonce/detail-annonce.component';
import {AuthGuard} from '../../shared/guards/auth-guard.service';


@NgModule({
    entryComponents: [],
    declarations: [
    ListeAnnoncesComponent,
    DetailAnnonceComponent,
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        HttpClientModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
        MatToolbarModule,
        ReactiveFormsModule,
        MatSliderModule,
        FormsModule,
        RouterModule.forChild([
            {path: '', component: ListeAnnoncesComponent, canActivate: [AuthGuard]},
            {path: 'detail/:id', component: DetailAnnonceComponent, canActivate: [AuthGuard]},
         ])
    ],
    exports: [

    ]
})
export class AnnuaireModule { }

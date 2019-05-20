import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule, MatMenuModule,
    MatSliderModule,
    MatSnackBarModule, MatToolbarModule
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ListeAnnoncesHorsConnexionComponent} from './liste-annonces/liste-annonces-hors-connexion.component';
import {DetailAnnonceHorsConnexionComponent} from './detail-annonce/detail-annonce-hors-connexion.component';


@NgModule({
    entryComponents: [],
    declarations: [
        ListeAnnoncesHorsConnexionComponent,
        DetailAnnonceHorsConnexionComponent,
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
            {path: '', component: ListeAnnoncesHorsConnexionComponent},
            {path: 'detail/:id', component: DetailAnnonceHorsConnexionComponent}
        ])
    ],
    exports: []
})
export class AnnuaireModule {
}

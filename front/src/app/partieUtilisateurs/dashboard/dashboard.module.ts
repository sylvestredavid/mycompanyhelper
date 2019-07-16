import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatIconModule, MatPaginatorModule, MatSortModule, MatTableModule} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthGuard} from '../../shared/guards/auth-guard.service';
import {DashboardComponent} from './dashboard.component';
import {GraphiqueComponent} from './graphique/graphique.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {TableauProduitComponent} from './tableau-produit/tableau-produit.component';
import {TableauClientsComponent} from './tableau-clients/tableau-clients.component';
import {TopFournisseursComponent} from './top-fournisseurs/top-fournisseurs.component';
import {ListeCalendrierComponent} from './liste-calendrier/liste-calendrier.component';
import {FullCalendarModule} from 'primeng/fullcalendar';
import {CalendarModule} from 'primeng/primeng';
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [
    DashboardComponent,
    GraphiqueComponent,
    TableauProduitComponent,
    TableauClientsComponent,
    TopFournisseursComponent,
    ListeCalendrierComponent,
  ],
    imports: [
        FullCalendarModule,
        CalendarModule,
        CommonModule,
        HttpClientModule,
        MatTableModule,
        MatIconModule,
        MatSortModule,
        ScrollingModule,
        MatPaginatorModule,
        ReactiveFormsModule,
        FormsModule,
        NgxChartsModule,
        RouterModule.forChild([
            {path: '', canActivate: [AuthGuard], component: DashboardComponent},
        ]),
        SharedModule
    ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }

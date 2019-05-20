import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatGridListModule, MatCardModule
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthGuard} from '../../shared/guards/auth-guard.service';
import {DashboardComponent} from './dashboard.component';
import { GraphiqueComponent } from './graphique/graphique.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TableauProduitComponent } from './tableau-produit/tableau-produit.component';
import { TableauClientsComponent } from './tableau-clients/tableau-clients.component';
import { TopFournisseursComponent } from './top-fournisseurs/top-fournisseurs.component';
import {FournisseurGuard} from '../../shared/guards/fournisseur-guard.service';
import {IsConnectedGuard} from '../../shared/guards/is-connected-guard.service';
import { ListeCalendrierComponent } from './liste-calendrier/liste-calendrier.component';
import {FullCalendarModule} from 'primeng/fullcalendar';
import {CalendarModule} from 'primeng/primeng';

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
    ])
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendrierComponent} from './calendrier/calendrier.component';
import {RouterModule} from '@angular/router';
import {AuthGuard} from '../../shared/guards/auth-guard.service';
import {FullCalendarModule} from 'primeng/fullcalendar';
import {CalendarModule} from 'primeng/primeng';
import { CalendrierDialComponent } from './calendrier/calendrier-dial/calendrier-dial.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material';

@NgModule({
  entryComponents: [],
  declarations: [CalendrierComponent],
  imports: [
    FullCalendarModule,
      CalendarModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild([
      {path: '', canActivate: [AuthGuard], component: CalendrierComponent},
    ])
  ]
})
export class CalendrierModule { }

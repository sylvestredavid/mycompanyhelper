import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendrierComponent} from './calendrier/calendrier.component';
import {RouterModule} from '@angular/router';
import {AuthGuard} from '../../shared/guards/auth-guard.service';
import {FullCalendarModule} from 'primeng/fullcalendar';
import {CalendarModule} from 'primeng/primeng';
import {CalendrierDialComponent} from './calendrier/calendrier-dial/calendrier-dial.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule, MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule
} from '@angular/material';

@NgModule({
    entryComponents: [CalendrierDialComponent],
    declarations: [
        CalendrierComponent,
        CalendrierDialComponent
    ],
    imports: [
        FullCalendarModule,
        CalendarModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        FormsModule,
        MatDatepickerModule,
        CommonModule,
        RouterModule.forChild([
            {path: '', canActivate: [AuthGuard], component: CalendrierComponent},
        ])
    ],
    providers: [
        MatDatepickerModule,
    ]
})
export class CalendrierModule {
}

import {NgModule} from '@angular/core';
import {CoreComponent} from './core.component';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from '../../app-routing.module';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {
    MatAutocompleteModule, MatBadgeModule,
    MatButtonModule, MatDialogModule,
    MatFormFieldModule, MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule, MatToolbarModule
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [
    ],
    exports: [
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatDialogModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatMenuModule,
        HttpClientModule,
        MatToolbarModule,
        ReactiveFormsModule,
        MatBadgeModule,
    ]
})
export class CoreModule {
}

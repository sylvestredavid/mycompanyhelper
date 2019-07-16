import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputReadOnlyDirective} from './directives/input-read-only.directive';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
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
    MatTableModule
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CardNumberPipe} from './pipes/card-number.pipe';
import {DateFrPipe} from "./pipes/date-fr.pipe";

@NgModule({
    declarations: [
        InputReadOnlyDirective,
        CardNumberPipe,
        DateFrPipe
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        HttpClientModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatIconModule,
        MatStepperModule,
        ScrollingModule,
        MatSnackBarModule,
        MatPaginatorModule,
        MatRadioModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        FormsModule,
    ],
    exports: [
        InputReadOnlyDirective,
        CardNumberPipe,
        DateFrPipe
    ]
})
export class SharedModule {
}

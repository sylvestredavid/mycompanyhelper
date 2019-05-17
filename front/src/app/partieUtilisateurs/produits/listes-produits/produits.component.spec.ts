import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProduitsComponent} from './produits.component';
import {ProduitsHorsVenteComponent} from '../produits-hors-vente/produits-hors-vente.component';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
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

describe('ProduitsComponent', () => {
    let component: ProduitsComponent;
    let fixture: ComponentFixture<ProduitsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ProduitsComponent,
                ProduitsHorsVenteComponent,
            ],
            imports: [
                CommonModule,
                SharedModule,
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
                ReactiveFormsModule,
                MatCheckboxModule,
                FormsModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProduitsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

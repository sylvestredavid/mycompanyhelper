import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TableauProduitComponent} from './tableau-produit.component';

describe('TableauProduitComponent', () => {
  let component: TableauProduitComponent;
  let fixture: ComponentFixture<TableauProduitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableauProduitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableauProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

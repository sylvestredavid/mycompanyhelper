import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProduitsHorsVenteComponent} from './produits-hors-vente.component';

describe('ProduitsHorsVenteComponent', () => {
  let component: ProduitsHorsVenteComponent;
  let fixture: ComponentFixture<ProduitsHorsVenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProduitsHorsVenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduitsHorsVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

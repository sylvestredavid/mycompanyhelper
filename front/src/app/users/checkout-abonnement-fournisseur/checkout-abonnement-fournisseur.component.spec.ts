import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutAbonnementFournisseurComponent } from './checkout-abonnement-fournisseur.component';

describe('CheckoutAbonnementComponent', () => {
  let component: CheckoutAbonnementFournisseurComponent;
  let fixture: ComponentFixture<CheckoutAbonnementFournisseurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutAbonnementFournisseurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutAbonnementFournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

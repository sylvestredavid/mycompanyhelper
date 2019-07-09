import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CheckoutAbonnementComponent} from './checkout-abonnement.component';

describe('CheckoutAbonnementComponent', () => {
  let component: CheckoutAbonnementComponent;
  let fixture: ComponentFixture<CheckoutAbonnementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutAbonnementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutAbonnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

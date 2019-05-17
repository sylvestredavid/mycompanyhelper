import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFacturesComponent } from './client-factures.component';

describe('ClientFacturesComponent', () => {
  let component: ClientFacturesComponent;
  let fixture: ComponentFixture<ClientFacturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientFacturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFacturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FournisseursListeComponent } from './fournisseurs-liste.component';

describe('FournisseursListeComponent', () => {
  let component: FournisseursListeComponent;
  let fixture: ComponentFixture<FournisseursListeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FournisseursListeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FournisseursListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

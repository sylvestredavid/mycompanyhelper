import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CoreFournisseursComponent} from './core-fournisseurs.component';

describe('CoreFournisseursComponent', () => {
  let component: CoreFournisseursComponent;
  let fixture: ComponentFixture<CoreFournisseursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoreFournisseursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreFournisseursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

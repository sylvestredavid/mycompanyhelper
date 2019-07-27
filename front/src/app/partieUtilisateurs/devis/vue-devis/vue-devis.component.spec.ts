import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VueDevisComponent } from './vue-devis.component';

describe('VueDevisComponent', () => {
  let component: VueDevisComponent;
  let fixture: ComponentFixture<VueDevisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VueDevisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VueDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

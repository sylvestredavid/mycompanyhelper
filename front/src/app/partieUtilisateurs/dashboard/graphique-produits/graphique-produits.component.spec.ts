import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GraphiqueProduitsComponent} from './graphique-produits.component';

describe('GraphiqueProduitsComponent', () => {
  let component: GraphiqueProduitsComponent;
  let fixture: ComponentFixture<GraphiqueProduitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphiqueProduitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphiqueProduitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

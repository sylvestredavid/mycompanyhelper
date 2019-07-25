import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GraphiqueCaComponent} from './graphique-ca.component';

describe('GraphiqueProduitsComponent', () => {
  let component: GraphiqueCaComponent;
  let fixture: ComponentFixture<GraphiqueCaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphiqueCaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphiqueCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

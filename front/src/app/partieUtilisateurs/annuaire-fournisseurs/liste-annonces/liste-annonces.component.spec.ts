import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeAnnoncesComponent } from './liste-annonces.component';

describe('ListeAnnoncesHorsConnexionComponent', () => {
  let component: ListeAnnoncesComponent;
  let fixture: ComponentFixture<ListeAnnoncesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeAnnoncesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeAnnoncesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

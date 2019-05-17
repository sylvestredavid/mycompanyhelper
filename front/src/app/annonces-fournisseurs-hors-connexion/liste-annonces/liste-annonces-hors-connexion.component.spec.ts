import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeAnnoncesHorsConnexionComponent } from './liste-annonces-hors-connexion.component';

describe('ListeAnnoncesHorsConnexionComponent', () => {
  let component: ListeAnnoncesHorsConnexionComponent;
  let fixture: ComponentFixture<ListeAnnoncesHorsConnexionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeAnnoncesHorsConnexionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeAnnoncesHorsConnexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

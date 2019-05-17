import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAnnonceHorsConnexionComponent } from './detail-annonce-hors-connexion.component';

describe('DetailAnnonceHorsConnexionComponent', () => {
  let component: DetailAnnonceHorsConnexionComponent;
  let fixture: ComponentFixture<DetailAnnonceHorsConnexionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailAnnonceHorsConnexionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailAnnonceHorsConnexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

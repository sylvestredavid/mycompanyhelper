import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutGenreComponent } from './ajout-genre.component';

describe('MenuFournisseurComponent', () => {
  let component: AjoutGenreComponent;
  let fixture: ComponentFixture<AjoutGenreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjoutGenreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutGenreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

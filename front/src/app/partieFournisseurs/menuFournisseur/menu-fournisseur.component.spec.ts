import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuFournisseurComponent } from './menu-fournisseur.component';

describe('MenuFournisseurComponent', () => {
  let component: MenuFournisseurComponent;
  let fixture: ComponentFixture<MenuFournisseurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuFournisseurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuFournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

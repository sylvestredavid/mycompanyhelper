import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TopFournisseursComponent} from './top-fournisseurs.component';

describe('TopFournisseursComponent', () => {
  let component: TopFournisseursComponent;
  let fixture: ComponentFixture<TopFournisseursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopFournisseursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopFournisseursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

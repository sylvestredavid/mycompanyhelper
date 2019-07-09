import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SuiviDialComponent} from './suivi-dial.component';

describe('SuiviDialComponent', () => {
  let component: SuiviDialComponent;
  let fixture: ComponentFixture<SuiviDialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuiviDialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviDialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

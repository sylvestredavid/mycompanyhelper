import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChekoutDialComponent } from './chekout-dial.component';

describe('ChekoutDialComponent', () => {
  let component: ChekoutDialComponent;
  let fixture: ComponentFixture<ChekoutDialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChekoutDialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChekoutDialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

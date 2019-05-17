import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendrierDialComponent } from './calendrier-dial.component';

describe('CalendrierDialComponent', () => {
  let component: CalendrierDialComponent;
  let fixture: ComponentFixture<CalendrierDialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendrierDialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendrierDialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

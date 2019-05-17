import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeCalendrierComponent } from './liste-calendrier.component';

describe('ListeCalendrierComponent', () => {
  let component: ListeCalendrierComponent;
  let fixture: ComponentFixture<ListeCalendrierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeCalendrierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeCalendrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableauClientsComponent } from './tableau-clients.component';

describe('TableauClientsComponent', () => {
  let component: TableauClientsComponent;
  let fixture: ComponentFixture<TableauClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableauClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableauClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

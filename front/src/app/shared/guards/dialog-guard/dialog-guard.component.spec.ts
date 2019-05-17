import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGuardComponent } from './dialog-guard.component';

describe('DialogGuardComponent', () => {
  let component: DialogGuardComponent;
  let fixture: ComponentFixture<DialogGuardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogGuardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGuardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

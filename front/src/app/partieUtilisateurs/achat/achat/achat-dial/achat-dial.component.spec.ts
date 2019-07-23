import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AchatDialComponent } from './achat-dial.component';

describe('AchatDialComponent', () => {
  let component: AchatDialComponent;
  let fixture: ComponentFixture<AchatDialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AchatDialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AchatDialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

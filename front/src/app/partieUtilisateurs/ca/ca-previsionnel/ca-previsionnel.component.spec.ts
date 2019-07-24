import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaPrevisionnelComponent } from './ca-previsionnel.component';

describe('CaPrevisionnelComponent', () => {
  let component: CaPrevisionnelComponent;
  let fixture: ComponentFixture<CaPrevisionnelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaPrevisionnelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaPrevisionnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

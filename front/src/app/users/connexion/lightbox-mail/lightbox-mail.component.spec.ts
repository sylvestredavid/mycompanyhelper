import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LightboxMailComponent} from './lightbox-mail.component';

describe('LightboxMailComponent', () => {
  let component: LightboxMailComponent;
  let fixture: ComponentFixture<LightboxMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LightboxMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LightboxMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

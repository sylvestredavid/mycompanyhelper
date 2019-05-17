import { TestBed } from '@angular/core/testing';

import { CalendrierService } from './calendrier.service';

describe('CalendrierService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalendrierService = TestBed.get(CalendrierService);
    expect(service).toBeTruthy();
  });
});

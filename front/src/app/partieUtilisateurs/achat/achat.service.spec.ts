import { TestBed } from '@angular/core/testing';

import { AchatService } from './achat.service';

describe('AchatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AchatService = TestBed.get(AchatService);
    expect(service).toBeTruthy();
  });
});

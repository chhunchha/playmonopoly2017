/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserTicketsService } from './user-tickets.service';

describe('UserTicketsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserTicketsService]
    });
  });

  it('should ...', inject([UserTicketsService], (service: UserTicketsService) => {
    expect(service).toBeTruthy();
  }));
});

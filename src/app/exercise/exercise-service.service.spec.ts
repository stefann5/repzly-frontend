import { TestBed } from '@angular/core/testing';

import { ExerciseService } from './exercise-service.service';

describe('ExerciseServiceService', () => {
  let service: ExerciseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

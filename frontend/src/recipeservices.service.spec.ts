import { TestBed } from '@angular/core/testing';

import { RecipeservicesService } from './recipeservices.service';

describe('RecipeservicesService', () => {
  let service: RecipeservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

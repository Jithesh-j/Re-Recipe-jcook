import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreaterecipeComponent } from './createrecipe.component';

describe('CreaterecipeComponent', () => {
  let component: CreaterecipeComponent;
  let fixture: ComponentFixture<CreaterecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreaterecipeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreaterecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglerecipeviewComponent } from './singlerecipeview.component';

describe('SinglerecipeviewComponent', () => {
  let component: SinglerecipeviewComponent;
  let fixture: ComponentFixture<SinglerecipeviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SinglerecipeviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglerecipeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

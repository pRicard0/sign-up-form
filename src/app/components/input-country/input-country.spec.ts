import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCountry } from './input-country';

describe('InputCountry', () => {
  let component: InputCountry;
  let fixture: ComponentFixture<InputCountry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCountry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputCountry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

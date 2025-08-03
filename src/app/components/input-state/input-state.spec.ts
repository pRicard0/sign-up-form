import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputState } from './input-state';

describe('InputState', () => {
  let component: InputState;
  let fixture: ComponentFixture<InputState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputState]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCpf } from './input-cpf';

describe('InputCpf', () => {
  let component: InputCpf;
  let fixture: ComponentFixture<InputCpf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCpf]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputCpf);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

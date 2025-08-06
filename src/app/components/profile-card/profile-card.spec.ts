import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCard } from './profile-card';
import { formatDate } from '../../functions/formatDate';
import { formatCpf } from '../../functions/formatCpf';
import { formatPhoneNumber } from '../../functions/formatPhoneNumber';

describe('ProfileCard', () => {
  let component: ProfileCard;
  let fixture: ComponentFixture<ProfileCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileCard);
    component = fixture.componentInstance;

    component.user = {
      id: '1',
      name: 'João',
      email: 'joao@email.com',
      cpf: '12345678900',
      number: '11912345678',
      birthDate: new Date(1990, 0, 1),
      numberType: { name: 'Celular' },
      country: 'Brasil',
      state: 'SP',
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format CPF correctly', () => {
    const expected = formatCpf(component.user.cpf);
    expect(component.formattedCpf).toBe(expected);
  });

  it('should format phone number correctly', () => {
    const expected = formatPhoneNumber(component.user.number);
    expect(component.formattedPhone).toBe(expected);
  });

  it('should format birth date correctly', () => {
    const expected = formatDate(component.user.birthDate);
    expect(component.formattedBirthDate).toBe(expected);
  });

  it('should emit editEvent with user email on onEdit()', () => {
    spyOn(component.editEvent, 'emit');
    component.onEdit();
    expect(component.editEvent.emit).toHaveBeenCalledWith(component.user.email);
  });

  it('should return empty string for formattedCpf if user is null', () => {
    component.user = null as any;
    expect(component.formattedCpf).toBe('');
  });

  it('should return empty string for formattedPhone if user is null', () => {
    component.user = null as any;
    expect(component.formattedPhone).toBe('');
  });

  it('should return empty string for formattedBirthDate if user is null', () => {
    component.user = null as any;
    expect(component.formattedBirthDate).toBe('');
  });
});
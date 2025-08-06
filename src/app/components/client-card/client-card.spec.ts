import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCard } from './client-card';
import { SharedModule } from '../../services/shared/shared.modules';
import { User } from '../../interfaces/user';

const mockUser: User = {
  id: '123456',
  name: 'João da Silva',
  email: 'joao.silva@example.com',
  country: 'Brasil',
  birthDate: new Date('1990-05-20'),
  state: 'SP',
  cpf: '123.456.789-00',
  number: '11999999999',
  numberType: {
    name: 'Celular'
  }
};

describe('ClientCard', () => {
  let component: ClientCard;
  let fixture: ComponentFixture<ClientCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientCard);
    component = fixture.componentInstance;

    component.user = mockUser

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

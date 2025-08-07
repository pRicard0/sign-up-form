import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUser } from './edit-user';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { User } from '../../interfaces/user';
import { of, throwError } from 'rxjs';
import { TOASTMESSAGE } from '../../services/shared/strings';
import { StoreModule } from '@ngrx/store';

const mockUsers: User[] = [
  {
    id: "123",
    name: 'Jane',
    email: 'jane@example.com',
    country: 'Brasil',
    birthDate: new Date('1990-01-01'),
    state: 'SP',
    cpf: '12345678900',
    number: '11912345678',
    numberType: { name: 'Celular' }
  }
]

const mockCountries: Country[] = [
  {
    id: 1,
    name: 'Brasil',
    states: [
      { id: 11, name: 'São Paulo' },
      { id: 12, name: 'Rio de Janeiro' }
    ]
  },
  {
    id: 2,
    name: 'Argentina',
    states: [
      { id: 21, name: 'Buenos Aires' },
      { id: 22, name: 'Córdoba' }
    ]
  }
];


describe('EditUser', () => {
  let component: EditUser;
  let fixture: ComponentFixture<EditUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EditUser,
        StoreModule.forRoot({}),
      ],
      providers: [
        provideHttpClient(),
        provideEnvironmentNgxMask(),
        MessageService,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => {
                if (key === 'email') return mockUsers[0].email;
                return null;
              }
            }),
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  if (key === 'email') return mockUsers[0].email;
                  return null;
                }
              }
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load countries and user data on ngOnInit', () => {
    spyOn(component.countryService, 'getCountries').and.returnValue(of(mockCountries));
    spyOn(component.authService, 'getUserDetails').and.returnValue(of(mockUsers));
    component.ngOnInit();

    expect(component.countryService.getCountries).toHaveBeenCalled();
    expect(component.authService.getUserDetails).toHaveBeenCalledWith(mockUsers[0].email);

    const form = component.formValue;
    expect(form).toBeDefined();
    expect(form.get('name')?.value).toBe(mockUsers[0].name);
    expect(form.get('email')?.value).toBe(mockUsers[0].email);
    expect(form.get('cpf')?.value).toBe(mockUsers[0].cpf);
    expect(form.get('birthDate')?.value).toEqual(new Date(mockUsers[0].birthDate));
  });
  
  it('should update user and navigate on successful submit', () => {
    const updatedUser = {
      name: 'Jane',
      email: 'jane.updated@example.com',
      country: 'Brasil',
      birthDate: new Date('1990-01-01'),
      state: 'SP',
      cpf: '12345678900',
      number: '11912345678',
      numberType: { name: 'Celular' }
    }
    component.formValue.setValue(updatedUser);
    component.userId = '123';
    component.email = 'jane@example.com';
    component.loggedEmail = 'jane@example.com';

    const updateUserSpy = spyOn(component.authService, 'updateUser').and.returnValue(of({
      id: '123',
      ...updatedUser
    }));
    const messageSpy = spyOn(component.messageService, 'add');
    const navigateSpy = spyOn(component.router, 'navigate');

    component.onSubmit(component.formValue.value);

    expect(localStorage.getItem('email')).toBe('jane.updated@example.com');

    expect(updateUserSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      ...component.formValue.value,
      id: '123'
    }));

    expect(messageSpy).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Usuário atualizado com sucesso!'
    });
    expect(navigateSpy).toHaveBeenCalledWith([component.URL.HOME_URL]);
  });

  it('should show error message on failed user update', () => {
    const mockUser: User = mockUsers[0];
    component['userId'] = mockUser.id;
    component.email = mockUser.email;
    component.loggedEmail = mockUser.email;

    const expectedError = new Error('Erro ao atualizar');

    const updateUserSpy = spyOn(component.authService, 'updateUser').and.returnValue(throwError(() => expectedError));
    const messageServiceSpy = spyOn(component.messageService, 'add');
    const consoleSpy = spyOn(console, 'error');

    component.onSubmit(mockUser);

    expect(updateUserSpy).toHaveBeenCalledWith({ ...mockUser, id: mockUser.id });
    expect(consoleSpy).toHaveBeenCalledWith(jasmine.any(String), expectedError);
    expect(messageServiceSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Erro',
      detail: TOASTMESSAGE.ERROR
    });
  });
});

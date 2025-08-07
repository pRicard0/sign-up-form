import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login } from './login';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { StoreModule } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { TOASTMESSAGE, URL } from '../../services/shared/strings';

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

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authService: AuthService;
  let router: Router;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Login,
        StoreModule.forRoot({}),
    ],
      providers: [
        provideHttpClient(),
        MessageService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: {}, queryParams: {} } }
        }
    ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    messageService = TestBed.inject(MessageService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home if user is found', () => {
    const email = mockUsers[0].email;
    component.loginForm.setValue({ email });

    spyOn(authService, 'getUserDetails').and.returnValue(of(mockUsers));
    const navigateSpy = spyOn(router, 'navigate');

    component.onLogin();

    expect(authService.getUserDetails).toHaveBeenCalledWith(email);
    expect(localStorage.getItem('email')).toBe(email);
    expect(navigateSpy).toHaveBeenCalledWith([URL.HOME_URL]);
  });

  it('should show error message if user is not found', () => {
    const email = 'notfound@example.com';
    component.loginForm.setValue({ email });

    spyOn(authService, 'getUserDetails').and.returnValue(of([]));
    const messageSpy = spyOn(messageService, 'add');

    component.onLogin();

    expect(messageSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Erro',
      detail: TOASTMESSAGE.LOGIN_EMAIL_ERROR
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Register } from './register';
import { provideHttpClient } from '@angular/common/http';
import { SharedModule } from '../../services/shared/shared.modules';
import { MessageService } from 'primeng/api';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TOASTMESSAGE, URL } from '../../services/shared/strings';
import { StoreModule } from '@ngrx/store';


describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        StoreModule.forRoot({})
      ],
      providers: [
        provideHttpClient(),
        provideEnvironmentNgxMask(),
        Router,
        MessageService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: {}, queryParams: {} } }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form, load countries and set isLogged on ngOnInit', () => {
    const mockCountries = [{ id: 1, name: 'Brasil', states: [] }];
    spyOn(component.countryService, 'getCountries').and.returnValue(of(mockCountries));
    spyOn(component, 'setCountryValidator').and.callThrough();
    spyOn(localStorage, 'getItem').and.returnValue('test@example.com');
    component.ngOnInit();

    expect(component.formValue).toBeDefined();

    expect(component.countryService.getCountries).toHaveBeenCalled();

    expect(component.setCountryValidator).toHaveBeenCalledWith(mockCountries);

    expect(component.isLogged).toBe('test@example.com');
  });


  it('should show success message and navigate to home if isLogged is set', () => {
    component.isLogged = 'test@example.com';
    spyOn(component.authService, 'registerUser').and.returnValue(of({}));
    spyOn(component.messageService, 'add');
    spyOn(component.router, 'navigate');

    component.onSubmit({});

    expect(component.authService.registerUser).toHaveBeenCalled();
    expect(component.messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success',
      summary: 'Sucesso',
      detail: TOASTMESSAGE.CREATE_SUCCESS
    }));
    expect(component.router.navigate).toHaveBeenCalledWith([URL.HOME_URL]);
  });

  it('should show success message and navigate to login if isLogged is not set', () => {
    component.isLogged = null;
    spyOn(component.authService, 'registerUser').and.returnValue(of({}));
    spyOn(component.messageService, 'add');
    spyOn(component.router, 'navigate');

    component.onSubmit({});

    expect(component.authService.registerUser).toHaveBeenCalled();
    expect(component.messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success',
      summary: 'Sucesso',
      detail: TOASTMESSAGE.CREATE_SUCCESS
    }));
    expect(component.router.navigate).toHaveBeenCalledWith([URL.LOGIN_URL]);
  });

  it('should show error message when registerUser errors', () => {
    const mockError = new Error('fail');

    spyOn(console, 'error');
    spyOn(component.authService, 'registerUser').and.returnValue(throwError(() => mockError));
    spyOn(component.messageService, 'add');

    component.onSubmit({});

    expect(component.authService.registerUser).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(jasmine.any(String), mockError);
    expect(component.messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'error',
      summary: 'Erro',
      detail: TOASTMESSAGE.ERROR
    }));
  });
});

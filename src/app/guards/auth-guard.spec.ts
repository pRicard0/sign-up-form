import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { authGuard } from './auth-guard';
import { URL } from '../services/shared/strings';

describe('authGuard', () => {
  let routerNavigateSpy: jasmine.Spy;

  const executeGuard: CanActivateFn = (...guardParameters) => 
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    routerNavigateSpy = jasmine.createSpy('navigate');

    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: routerNavigateSpy
          }
        }
      ]
    });

    localStorage.clear();
  });

  it('should allow access when email exists in localStorage', () => {
    localStorage.setItem('email', 'test@example.com');

    const result = executeGuard({} as any, {} as any);
    expect(result).toBeTrue();
    expect(routerNavigateSpy).not.toHaveBeenCalled();
  });

  it('should deny access and navigate to login when email is missing', () => {
    const result = executeGuard({} as any, {} as any);

    expect(result).toBeFalse();
    expect(routerNavigateSpy).toHaveBeenCalledWith([URL.LOGIN_URL]);
  });
});
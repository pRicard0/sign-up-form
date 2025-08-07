import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { HttpErrorInterceptor } from './http-error-interceptor';
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { TOASTMESSAGE } from '../services/shared/strings';
import { TimeoutError, catchError, firstValueFrom, of, throwError } from 'rxjs';

class MockMessageService {
  add = jasmine.createSpy('add');
}

describe('HttpErrorInterceptor', () => {
  let messageService: MockMessageService;
  const dummyRequest = new HttpRequest('GET', '/');

  const createInterceptor = (): HttpInterceptorFn => {
    return (req, next) => TestBed.runInInjectionContext(() => HttpErrorInterceptor(req, next));
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MessageService, useClass: MockMessageService }],
    });

    messageService = TestBed.inject(MessageService) as unknown as MockMessageService;
  });

  it('should be created', () => {
    const interceptor = createInterceptor();
    expect(interceptor).toBeTruthy();
  });

  it('should handle TimeoutError and show timeout message', async () => {
    const next: HttpHandlerFn = () => throwError(() => new TimeoutError());
    const interceptor = createInterceptor();

    await firstValueFrom(interceptor(dummyRequest, next).pipe(
      catchError(() => of(null)) 
    ));

    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      detail: TOASTMESSAGE.TIMEOUT
    }));
  });

  it('should handle HttpErrorResponse with status 0 (offline) and show offline message', async () => {
    const error = new HttpErrorResponse({ status: 0, statusText: 'Unknown Error', url: '/' });
    const next: HttpHandlerFn = () => throwError(() => error);
    const interceptor = createInterceptor();

    await firstValueFrom(interceptor(dummyRequest, next).pipe(
      catchError(() => of(null))
    ));

    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      detail: TOASTMESSAGE.OFFLINE
    }));
  });

  it('should handle HttpErrorResponse with 4xx status and show client error message', async () => {
    const error = new HttpErrorResponse({ status: 404, statusText: 'Not Found', url: '/', error: { message: 'Usuário não encontrado' } });
    const next: HttpHandlerFn = () => throwError(() => error);
    const interceptor = createInterceptor();

    await firstValueFrom(interceptor(dummyRequest, next).pipe(
      catchError(() => of(null))
    ));

    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      detail: 'Usuário não encontrado'
    }));
  });

  it('should handle HttpErrorResponse with 5xx status and show server error message', async () => {
    const error = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error', url: '/' });
    const next: HttpHandlerFn = () => throwError(() => error);
    const interceptor = createInterceptor();

    await firstValueFrom(interceptor(dummyRequest, next).pipe(
      catchError(() => of(null))
    ));

    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      detail: TOASTMESSAGE.SERVER_ERROR
    }));
  });

  it('should handle unknown errors with generic message', async () => {
    const next: HttpHandlerFn = () => throwError(() => new Error('Unexpected error'));
    const interceptor = createInterceptor();

    await firstValueFrom(interceptor(dummyRequest, next).pipe(
      catchError(() => of(null))
    ));

    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      detail: TOASTMESSAGE.ERROR
    }));
  });
});
import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, throwError, TimeoutError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { TOASTMESSAGE } from '../services/shared/strings';
import { LogService } from '../services/log.service';

export const HttpErrorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const messageService = inject(MessageService);
  const logService = inject(LogService)

  return next(req).pipe(
    catchError((error: any) => {
      let message = TOASTMESSAGE.ERROR;

      if (error instanceof TimeoutError) {
        message = TOASTMESSAGE.TIMEOUT;
      } else if (error instanceof HttpErrorResponse) {
        if (error.status === 0) {
          message = TOASTMESSAGE.OFFLINE;
        } else if (error.status >= 400 && error.status < 500) {
          message = error.error?.message || TOASTMESSAGE.CLIENT_ERROR;
        } else if (error.status >= 500) {
          message = TOASTMESSAGE.SERVER_ERROR;
        }
      }

      logService.error(message)
      messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: message,
        life: 5000,
      });

      return throwError(() => error);
    })
  );
};

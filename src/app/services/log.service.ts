import { Injectable, isDevMode } from '@angular/core';

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private isDev = isDevMode();

  log(level: LogLevel, message: string, context?: any) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] ${message}`;

    if (this.isDev) {
    switch (level) {
        case LogLevel.INFO:
          console.info(formattedMessage, context ?? '');
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage, context ?? '');
          break;
        case LogLevel.ERROR:
          console.error(formattedMessage, context ?? '');
          break;
        case LogLevel.DEBUG:
          console.debug(formattedMessage, context ?? '');
          break;
      }
    }
  }

  info(message: string, context?: any) {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: any) {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context?: any) {
    this.log(LogLevel.ERROR, message, context);
  }

  debug(message: string, context?: any) {
    this.log(LogLevel.DEBUG, message, context);
  }
}

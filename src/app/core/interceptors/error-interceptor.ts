import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Si è verificato un errore';

        if (error.error instanceof ErrorEvent) {
          // errore client side
          errorMessage = error.error.message;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = 'Richiesta non valida';
              break;
            case 401:
              errorMessage = 'Non autorizzato';
              break;
            case 403:
              errorMessage = 'Accesso negato';
              break;
            case 404:
              errorMessage = 'Risorsa non trovata';
              break;
            case 500:
              errorMessage = 'Errore interno del server';
              break;
            default:
              errorMessage = error.error?.message || 'Errore di connessione';
          }
        }

        if (error.status !== 401) { // Non mostrare notifica per errori 401 
          this.notificationService.error('Errore', errorMessage);
        }

        return throwError(() => error);
      })
    );
  }
}

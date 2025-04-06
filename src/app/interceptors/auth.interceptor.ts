import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, EMPTY } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        console.error('CORS/Network Error - Verify backend is running and CORS configured');
        return EMPTY
      }

      if (error.status === 403) {
        router.navigate(['/login']);
        return EMPTY;
      }

      return throwError(() => error);
    })
  );
};

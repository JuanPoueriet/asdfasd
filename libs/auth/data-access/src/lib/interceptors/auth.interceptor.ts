import {
    HttpInterceptorFn,
    HttpRequest,
    HttpHandlerFn,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '@univeex/auth/data-access';

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);

    const authReq = req.clone({
        withCredentials: true
    });

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            const isUnauthorized = error.status === 401;
            
            const publicAuthApiPaths = [
                '/auth/login',
                '/auth/register',
                '/auth/refresh',
                '/auth/status',
                '/auth/forgot-password',
                '/auth/reset-password'
            ];
            
            const isPublicAuthApiRoute = publicAuthApiPaths.some(path => authReq.url.includes(path));

            if (isUnauthorized && !isPublicAuthApiRoute) {
                console.log('[Interceptor] Token expirado detectado. Intentando refrescar...');
                return authService.refreshAccessToken().pipe(
                    switchMap(() => {
                        console.log('[Interceptor] Token refrescado. Reintentando la solicitud original.');
                        return next(authReq);
                    }),
                    catchError((refreshError) => {
                        console.error('[Interceptor] Fallo al refrescar el token. Deslogueando usuario.', refreshError);
                        authService.logout();
                        return throwError(() => refreshError);
                    })
                );
            }
            
            return throwError(() => error);
        })
    );
};

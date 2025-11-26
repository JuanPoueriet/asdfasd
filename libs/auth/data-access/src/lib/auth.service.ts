import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  Observable,
  catchError,
  map,
  tap,
  throwError,
  of,
  BehaviorSubject,
  take,
} from 'rxjs';

import { RegisterPayload, LoginCredentials, UserPayload, UserStatus } from '@univeex/users/domain';
import { User } from '@univeex/users/domain';
// TODO: Refactor enum out of shared/enums or keep it if it is shared/util
import { AuthStatus } from '@univeex/shared/util-types';
// import { NotificationService } from './notification'; // Need to fix this dependency
// import { WebSocketService } from './websocket.service'; // Need to fix this dependency
// import { ModalService } from '../../shared/service/modal.service'; // Need to fix this dependency

// Temporary interfaces until moved to domain
interface LoginResponse {
  user: User;
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // TODO: Fix environment variable
  private readonly apiUrl = '/api/v1/auth';

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.pending);

  public readonly currentUser = computed(() => this._currentUser());
  public readonly authStatus = computed(() => this._authStatus());
  public readonly isAuthenticated = computed(
    () => this._authStatus() === AuthStatus.authenticated
  );

  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this._isAuthenticated.asObservable();

  private _user = new BehaviorSubject<User | null>(null);
  public user$ = this._user.asObservable();

  // constructor(private modalService: ModalService) {
  constructor() {
    // this.listenForForcedLogout();
  }

  // private webSocketService = inject(WebSocketService);

  /*
  private listenForForcedLogout(): void {
    // Espera a que la conexión esté lista
    this.webSocketService.connectionReady$.pipe(take(1)).subscribe(() => {
      console.log(
        "WebSocket connection is ready. Listening for 'force-logout'."
      );
      this.webSocketService
        .listen<{ reason: string }>('force-logout')
        .subscribe((data) => {
          console.log('Forced logout event received:', data.reason);
          this.logout();
          // this.modalService
          //   .open({
          //     title: 'Sesión Terminada',
          //     message: data.reason,
          //     confirmText: 'Aceptar',
          //   })
          //   ?.onClose$.subscribe(() => {});
        });
    });
  }
  */

  hasPermissions(requiredPermissions: string[]): boolean {
    const user = this.currentUser();
    if (!user || !user.permissions) {
      return false;
    }
    if (user.permissions.includes('*')) {
      return true;
    }
    return requiredPermissions.every((p) => user.permissions.includes(p));
  }

  refreshAccessToken(): Observable<LoginResponse> {
    return this.http
      .get<LoginResponse>(`${this.apiUrl}/refresh`, { withCredentials: true })
      .pipe()
      .pipe(
        tap((response) => {
          if (response && response.user && response.access_token) {
            this._isAuthenticated.next(true);
            this._user.next(response.user);
            console.log('[AuthService] Token refrescado exitosamente');
          }
        })
      );
  }

  login(credentials: LoginCredentials): Observable<User> {
    const url = `${this.apiUrl}/login`;
    return this.http
      .post<{ user: User }>(url, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          this._currentUser.set(response.user);
          this._authStatus.set(AuthStatus.authenticated);
          this._user.next(response.user);
          this._isAuthenticated.next(true);

          // this.webSocketService.connect();
          // this.webSocketService.emit('user-status', { isOnline: true });
          // this.listenForForcedLogout();
        }),
        map((response) => response.user),
        catchError((err) => this.handleError('login', err))
      );
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.apiUrl}/status`;
    this._authStatus.set(AuthStatus.pending);
    return this.http.get<{ user: User }>(url, { withCredentials: true }).pipe(
      map((res) => {
        this._currentUser.set(res.user);
        this._authStatus.set(AuthStatus.authenticated);
        this._user.next(res.user);
        this._isAuthenticated.next(true);
        // this.webSocketService.connect();
        // this.webSocketService.emit('user-status', { isOnline: true });
        // this.listenForForcedLogout();
        return true;
      }),
      catchError(() => {
        this._currentUser.set(null);
        this._authStatus.set(AuthStatus.unauthenticated);
        // this.webSocketService.disconnect();

        this._user.next(null);
        this._isAuthenticated.next(false);
        return of(false);
      })
    );
  }

  getPermissions$(): Observable<string[]> {
    return this._user.pipe(map((user) => user?.permissions || []));
  }

  register(payload: RegisterPayload): Observable<User> {
    const url = `${this.apiUrl}/register`;
    return this.http
      .post<{ user: User }>(url, payload, { withCredentials: true })
      .pipe(
        map((response) => response.user),
        tap((user) => {
          this._currentUser.set(user);
          this._authStatus.set(AuthStatus.authenticated);
          this.router.navigate(['/app/dashboard']);
        }),
        catchError((err) => this.handleError('register', err))
      );
  }

  logout(): void {
    const url = `${this.apiUrl}/logout`;
    this.http.post(url, {}, { withCredentials: true }).subscribe({
      complete: () => {
        this._currentUser.set(null);
        this._authStatus.set(AuthStatus.unauthenticated);
        // this.webSocketService.emit('user-status', { isOnline: false });
        // this.webSocketService.disconnect();

        this.router.navigate(['/auth/login']);
      },
    });
  }

  forgotPassword(
    email: string,
    recaptchaToken: string
  ): Observable<{ message: string }> {
    const url = `${this.apiUrl}/forgot-password`;
    return this.http
      .post<{ message: string }>(url, { email, recaptchaToken })
      .pipe(catchError((err) => this.handleError('forgotPassword', err)));
  }

  resetPassword(token: string, password: string): Observable<User> {
    const url = `${this.apiUrl}/reset-password`;
    return this.http
      .post<User>(url, { token, password })
      .pipe(catchError((err) => this.handleError('resetPassword', err)));
  }

  setPasswordFromInvitation(
    token: string,
    password: string
  ): Observable<LoginResponse> {
    const url = `${this.apiUrl}/set-password-from-invitation`;
    return this.http
      .post<LoginResponse>(url, { token, password }, { withCredentials: true })
      .pipe(
        tap((response) => {
          this._currentUser.set(response.user);
          this._authStatus.set(AuthStatus.authenticated);
          this._user.next(response.user);
          this._isAuthenticated.next(true);
        }),
        catchError((err) => this.handleError('setPasswordFromInvitation', err))
      );
  }

  private handleError(
    operation: string,
    error: HttpErrorResponse
  ): Observable<never> {
    let customErrorMessage =
      'Ocurrió un error inesperado. Por favor, intenta más tarde.';
    console.error(
      `Error en la operación '${operation}'. Código: ${error.status}`,
      error.error
    );

    if (error.error instanceof ErrorEvent) {
      customErrorMessage = `Error de red: ${error.error.message}`;
    } else {
      const serverError = error.error;
      if (serverError && typeof serverError.message === 'string') {
        customErrorMessage = serverError.message;
      } else if (serverError && Array.isArray(serverError.message)) {
        customErrorMessage = serverError.message.join('. ');
      } else if (error.status === 401) {
        customErrorMessage =
          'Credenciales inválidas. Por favor, verifica tu correo y contraseña.';
      } else if (error.status === 403) {
        customErrorMessage =
          'No tienes permiso o la verificación reCAPTCHA ha fallado.';
      } else if (error.status === 404) {
        customErrorMessage = 'El recurso solicitado no fue encontrado.';
      }
    }

    return throwError(() => ({
      status: error.status,
      message: customErrorMessage,
    }));
  }

  getInvitationDetails(token: string): Observable<{ firstName: string }> {
    const url = `${this.apiUrl}/invitation/${token}`;
    return this.http
      .get<{ firstName: string }>(url)
      .pipe(catchError((err) => this.handleError('getInvitationDetails', err)));
  }

  inviteUser(payload: UserPayload): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/invite`, payload);
  }

  updateUser(id: string, payload: UserPayload): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, payload);
  }

  updateUserStatus(id: string, status: UserStatus): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/status`, { status });
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // private notificationService = inject(NotificationService);

  impersonate(userId: string): Observable<User> {
    return this.http
      .post<{ user: User }>(
        `${this.apiUrl}/impersonate`,
        { userId },
        { withCredentials: true }
      )
      .pipe(
        tap((response) => {
          this._currentUser.set(response.user);
          this._authStatus.set(AuthStatus.authenticated);
          this._user.next(response.user);
          this._isAuthenticated.next(true);
          // this.notificationService.showSuccess(
          //   `Ahora estás viendo como ${response.user.firstName}`
          // );
          window.location.href = '/app/dashboard';
        }),
        map((response) => response.user),
        catchError((err) => this.handleError('impersonate', err))
      );
  }

  stopImpersonation(): Observable<User> {
    return this.http
      .post<{ user: User }>(
        `${this.apiUrl}/stop-impersonation`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap((response) => {
          this._currentUser.set(response.user);
          this._authStatus.set(AuthStatus.authenticated);
          this._user.next(response.user);
          this._isAuthenticated.next(true);
          // this.notificationService.showSuccess(
          //   'Has vuelto a tu cuenta original.'
          // );
          window.location.href = '/app/dashboard';
        }),
        map((response) => response.user),
        catchError((err) => this.handleError('stopImpersonation', err))
      );
  }
}

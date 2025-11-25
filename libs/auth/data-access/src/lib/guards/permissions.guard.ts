import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@univeex/auth/data-access';

export const permissionsGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredPermissions = route.data['permissions'] as string[] | undefined;

  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  const hasPermissions = authService.hasPermissions(requiredPermissions);

  if (hasPermissions) {
    return true;
  } else {
    return router.createUrlTree(['/app/unauthorized'], {
      queryParams: { url: state.url },
    });
  }
};

import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { SecurityService } from './security.service';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router: Router = inject(Router);
  const securityService: SecurityService = inject(SecurityService);

  if (!securityService.isLoggedIn()) {
    router.navigate(['login']);
    return false;
  }

  const requiredRoles = route.data['roles'] as string[] | undefined;

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const userRole = securityService.getUserRole();
  if (userRole && requiredRoles.includes(userRole)) {
    return true;
  }

  router.navigate(['accueil']);
  return false;
};


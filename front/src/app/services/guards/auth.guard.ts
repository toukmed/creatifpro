import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { session } from '../../utils/session';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router: Router = inject(Router);
  const protectedRoutes: string[] = [
    'home',
    'pointages',
    'personnels',
    'consommations',
    'projets',
    'paiements',
    'caisses',
    'devis',
    'facturations',
  ];
  return protectedRoutes.includes(state.url) && !session
    ? router.navigate(['/login'])
    : true;
};

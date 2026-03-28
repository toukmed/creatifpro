import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router: Router = inject(Router);
  const protectedRoutes: string[] = [
    '/accueil',
    '/pointages',
    '/employees',
    '/projets',
    '/utilisateurs',
    '/materiels',
    '/stock',
  ];
  let token = localStorage.getItem('auth_token');
  if (token !== null) {
    let decodedToken = jwtDecode(token);
    const isExpired =
      decodedToken && decodedToken.exp
        ? decodedToken.exp < Date.now() / 1000
        : false;
    if (isExpired) {
      router.navigate(['login']);
    }
    return protectedRoutes.includes(state.url) && !isExpired;
  } else {
    router.navigate(['login']);
    return false;
  }
};

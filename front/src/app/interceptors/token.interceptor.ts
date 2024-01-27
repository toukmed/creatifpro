import {
  HttpClient,
  HttpHandler,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable()
export class tokenInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    let token = localStorage.getItem('auth_token');
    if (token) {
      let decodedToken = jwtDecode(token);
      const isExpired =
        decodedToken && decodedToken.exp
          ? decodedToken.exp < Date.now() / 1000
          : false;
      if (!isExpired) {
        request = request.clone({
          headers: request.headers.set('Authorization', 'bearer ' + token),
        });
      } else {
        localStorage.removeItem('auth-token');
        this.router.navigate(['login']);
      }
    } else {
      this.router.navigate(['login']);
    }

    return next.handle(request);
  }
}

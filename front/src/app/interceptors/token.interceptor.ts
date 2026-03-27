import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable()
export class tokenInterceptor implements HttpInterceptor {
  private readonly publicEndpoints = ['/api/login', '/api/register'];

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    // Skip token injection for public endpoints
    if (this.publicEndpoints.some(url => request.url.includes(url))) {
      return next.handle(request);
    }

    let token = localStorage.getItem('auth_token');
    if (token) {
      let decodedToken = jwtDecode(token);
      const isExpired =
        decodedToken && decodedToken.exp
          ? decodedToken.exp < Date.now() / 1000
          : false;
      if (!isExpired) {
        request = request.clone({
          headers: request.headers.set('Authorization', 'Bearer ' + token),
        });
      } else {
        localStorage.removeItem('auth_token');
        this.router.navigate(['login']);
      }
    } else {
      this.router.navigate(['login']);
    }

    return next.handle(request);
  }
}

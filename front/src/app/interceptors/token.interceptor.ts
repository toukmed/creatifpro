import {
  HttpHandler,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { session, token } from '../utils/session';
import { Injectable } from '@angular/core';

@Injectable()
export class tokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (session) {
      request = request.clone({
        headers: request.headers.set('Authorization', 'bearer ' + token),
      });
    }

    return next.handle(request);
  }
}

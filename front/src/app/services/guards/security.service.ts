import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  private readonly loggedIn = false;
  private readonly token = window.localStorage.getItem('auth_token');

  constructor(private httpClient: HttpClient) {}

  isLoggedIn(): boolean {
    // Check if the token is present and not expired
    return !!this.token && !this.isTokenExpired(this.token);
  }

  private isTokenExpired(token: string): boolean {
    // Implement your token expiration logic here
    // For example, compare the token's expiration date with the current date
    const expirationDate =
      new Date(/* Extract the expiration date from the token */);
    return expirationDate <= new Date();
  }

  setAuthToken(token: string) {
    if (token !== null) {
      window.localStorage.setItem('auth_token', token);
    } else {
      window.localStorage.removeItem('auth_token');
    }
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  iss?: string;
  exp?: number;
  iat?: number;
  firstName?: string;
  lastName?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  constructor(private httpClient: HttpClient) {}

  isLoggedIn(): boolean {
    const token = window.localStorage.getItem('auth_token');
    return !!token && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken = jwtDecode(token);
      if (!decodedToken.exp) return true;
      return decodedToken.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  }

  private getDecodedToken(): DecodedToken | null {
    const token = window.localStorage.getItem('auth_token');
    if (!token) return null;
    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  }

  getUserRole(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.role ?? null;
  }

  isSuperAdmin(): boolean {
    return this.getUserRole() === 'SUPER_ADMIN';
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  hasManagementAccess(): boolean {
    const role = this.getUserRole();
    return role === 'SUPER_ADMIN' || role === 'ADMIN';
  }

  getUserName(): string | null {
    const decoded = this.getDecodedToken();
    if (!decoded) return null;
    return `${decoded.firstName ?? ''} ${decoded.lastName ?? ''}`.trim() || decoded.iss || null;
  }

  setAuthToken(token: string) {
    if (token !== null) {
      window.localStorage.setItem('auth_token', token);
    } else {
      window.localStorage.removeItem('auth_token');
    }
  }

  clearAuthToken(): void {
    window.localStorage.removeItem('auth_token');
  }
}

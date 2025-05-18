import { Injectable } from '@angular/core';
import { API_URL } from '../../../globals';
import { HttpClient } from '@angular/common/http';
import { LoginRequestDto } from '../../user/login/dtos/login-request-dto';
import { EMPTY, Observable, throwError } from 'rxjs';
import { Token } from '../token';
import { RefreshTokenRequest } from '../refresh-token-request';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class JwtService {
  constructor(private http: HttpClient) { }


  logout(): void {
    if (this.isLoggedIn()) {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
    }
  }

  sendLoginRequest(request: LoginRequestDto): Observable<any> {
    return this.http.post(API_URL + "/auth/login", request);
  }

  refreshToken(): Observable<any> {
    let refreshTokenId: any = "";
    if (typeof window !== 'undefined' && window.localStorage) {
      refreshTokenId = sessionStorage.getItem("refreshToken");
    }
    else{
      return EMPTY;
    }

    if (refreshTokenId == null) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }
   
    let body: RefreshTokenRequest = new RefreshTokenRequest(Number(refreshTokenId));
    return this.http.post(API_URL + "/auth/refresh-token", body);
  }

  isLoggedIn(): boolean {
    let token: string | null = this.getToken();

    if (token != null) {
      return true;
    }
    
    return false;
  }

  getLoggedInUser(): Observable<any> {
    let token: string | null = this.getToken();
    let decodedToken = null;
    let username = null;

    if (token != null) {
      decodedToken = jwtDecode(token);
      username = decodedToken.sub;
    }

    return this.http.get(API_URL + "/user/me?username=" + username);
  }

  getToken(): string | null{
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return sessionStorage.getItem("accessToken");
    }

    return null;
  }

  getRefreshToken(): string | null{
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return sessionStorage.getItem("refreshToken");
    }

    return null;
  }

  setTokens(token: Token) {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem("accessToken", token.accessToken);
      sessionStorage.setItem("refreshToken", token.refreshToken);
    }
  }

  decodeToken(token: string) {
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }

  private isSessionStorageAvailable(): boolean {
    return typeof sessionStorage !== undefined;
  }
}

import {Injectable} from '@angular/core';
import {tap} from "rxjs";
import {Tokens} from "../model/Tokens";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private httpClient: HttpClient) {
  }

  refreshToken() {
    return this.httpClient.post<any>(`${this.apiServerUrl}/refresh`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(tap((tokens: Tokens) => {
      this.setToken(tokens.jwt);
    }));
  }

  private getRefreshToken() {
    return localStorage.getItem("refreshToken");
  }

  public setRefreshToken(refreshToken: string) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  public setRoles(roles: []) {
    localStorage.setItem("roles", JSON.stringify(roles));
  }

  public getRoles() {
    //return roles array
    return JSON.parse(<string>localStorage.getItem("roles"));
  }

  public setToken(jwtToken: string) {
    localStorage.setItem("jwtToken", jwtToken);
  }

  public getToken(): string {
    return <string>localStorage.getItem("jwtToken");
  }

  public clear() {
    localStorage.clear();
  }

  public isLoggedIn() {
    return this.getRoles() && this.getToken();
  }

}

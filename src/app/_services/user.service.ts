import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserAuthService} from "./user-auth.service";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {User} from "../model/User";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiServerUrl = environment.apiBaseUrl;

  requestHeader = new HttpHeaders(
    {"No-Auth": "True"}
  );

  constructor(private httpClient: HttpClient, private userAuthService: UserAuthService) {
  }

  public login(loginData: any) {
    return this.httpClient.post(this.apiServerUrl + '/authenticate', loginData, {headers: this.requestHeader});
  }

  public addUser(user: User): Observable<User> {
    return this.httpClient.post<User>(`${this.apiServerUrl}/user/register`, user );
  }

  public getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.apiServerUrl}/user/all`);
  }

  public getUserByUsername(username: string): Observable<User> {
    return this.httpClient.get<User>(`${this.apiServerUrl}/user/find/${username}`);
  }

  public forUser() {
    return this.httpClient.get(this.apiServerUrl + '/forUser', {
      responseType: 'text',
    });
  }

  public forAdmin() {
    return this.httpClient.get(this.apiServerUrl + '/forAdmin', {responseType: 'text'});
  }

  // @ts-ignore
  public roleMatch(allowedRoles): boolean {
    let isMatch = false;
    const userRoles: any = this.userAuthService.getRoles();

    if (userRoles != null && userRoles) {
      if (userRoles.roleName.toString() === allowedRoles.toString()) {
        isMatch = true;
      } else {
        isMatch = false;
      }
      return isMatch;


      // for (let i = 0; i < userRoles.length; i++) {
      //   for (let j = 0; j < allowedRoles.length; j++) {
      //     if (userRoles.roleName === allowedRoles[j]) {
      //       isMatch = true;
      //       return isMatch;
      //     } else {
      //       return isMatch;
      //     }
      //   }
      // }
    }
  }
}

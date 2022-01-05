import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/User";
import {environment} from "../../environments/environment";
import {UserAuthService} from "./user-auth.service";

@Injectable({
  providedIn: 'root'
})
export class MemberService implements OnInit{
  private apiServerUrl = environment.apiBaseUrl;

  requestHeader = new HttpHeaders(
    {"No-Auth": "False"}
  );

  constructor(private httpClient: HttpClient, private userAuthService: UserAuthService,) { }

  ngOnInit(): void {
    const token = this.userAuthService.getToken();
  }

  public getMembers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.apiServerUrl}/user/all`);
  }

  public getMemberByUsername(username: string): Observable<User> {
    return this.httpClient.get<User>(`${this.apiServerUrl}/user/find/${username}`);
  }

  public addMember(member: User): Observable<User> {
    return this.httpClient.post<User>(`${this.apiServerUrl}/member/add`, member, {headers: this.requestHeader} );
  }

  public updateMember(member: User): Observable<User> {
    return this.httpClient.put<User>(`${this.apiServerUrl}/member/update`, member);
  }

  public deleteMember(username: string): Observable<User> {
    return this.httpClient.delete<User>(`${this.apiServerUrl}/member/delete/${username}`);
  }

}

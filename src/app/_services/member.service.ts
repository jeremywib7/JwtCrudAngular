import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Member} from "../model/member";
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

  public getMembers(): Observable<Member[]> {
    return this.httpClient.get<Member[]>(`${this.apiServerUrl}/member/all`);
  }

  public addMember(member: Member): Observable<Member> {
    return this.httpClient.post<Member>(`${this.apiServerUrl}/member/add`, member, {headers: this.requestHeader} );
  }

  public updateMember(member: Member): Observable<Member> {
    return this.httpClient.put<Member>(`${this.apiServerUrl}/member/update`, member);
  }

  public deleteMember(memberId: number): Observable<Member> {
    return this.httpClient.delete<Member>(`${this.apiServerUrl}/member/delete/${memberId}`);
  }

}

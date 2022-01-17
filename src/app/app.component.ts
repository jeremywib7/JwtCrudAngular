import { Component } from '@angular/core';
import {User} from "./model/User";
import {UserAuthService} from "./_services/user-auth.service";
import {Router} from "@angular/router";
import {UserService} from "./_services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sideBarOpen: any = true;

  constructor(private userAuthService: UserAuthService) {
  }

  public roleInternal() {
    return this.userAuthService.isLoggedIn() && this.userAuthService.getRoles() != 'Customer';
  }

  public sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  public roleExternal() {
    return this.userAuthService.isLoggedIn() && this.userAuthService.getRoles() === 'Customer';
  }
}

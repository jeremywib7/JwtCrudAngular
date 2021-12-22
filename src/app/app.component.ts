import { Component } from '@angular/core';
import {Member} from "./model/member";
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

  public isLoggedIn() {
    return this.userAuthService.isLoggedIn();
  }

  public sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}

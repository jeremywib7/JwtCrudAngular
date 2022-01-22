import { Component, OnInit } from '@angular/core';
import {UserAuthService} from "../../../_services/user-auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.css']
})
export class ForbiddenComponent implements OnInit {

  constructor(
    private userAuthService: UserAuthService,
    private router: Router
    ) { }

  ngOnInit(): void {
    if (this.userAuthService.getRoles() === "Customer") {
      this.router.navigate(['/']);
    }
  }

}

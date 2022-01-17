import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {UserService} from "../../../_services/user.service";
import {UserAuthService} from "../../../_services/user-auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  constructor(
    private userService: UserService,
    private userAuthService: UserAuthService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  public login(loginForm: NgForm) {
    this.userService.login(loginForm.value).subscribe(
      (response: any) => {

        // set in local storage
        this.userAuthService.setRoles(response.user.role);
        this.userAuthService.setToken(response.jwtToken);

        const userRole = response.user.role.roleName;
        // const userRole = response.user.role[0].roleName;

        if (userRole === "Admin") {
          this.router.navigate(['/admin']);
        } else if (userRole === "User") {
          this.router.navigate(['/user']);
        } else if (userRole === "Customer") {
          this.router.navigate(['/']);
        }

      },
      (error) => {
        alert("Wrong credentials");
        console.log(error);
      }
    );
  }

}

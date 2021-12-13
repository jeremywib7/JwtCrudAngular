import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private loginForm: any;

  constructor() {
  }

  ngOnInit(): void {
  }

  login(loginForm: any) {
    this.loginForm = loginForm;
    console.log("Form is submited")
  }

}

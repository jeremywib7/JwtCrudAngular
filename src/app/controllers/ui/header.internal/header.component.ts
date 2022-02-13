import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserAuthService} from "../../../_services/user-auth.service";
import {Router} from "@angular/router";
import {UserService} from "../../../_services/user.service";

@Component({
  selector: 'app-header-internal',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class InternalHeaderComponent implements OnInit {
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();

  constructor(private userAuthService: UserAuthService, private router: Router, public userService: UserService) {
  }

  ngOnInit(): void {
  }

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }

  public isLoggedIn() {
    return this.userAuthService.isLoggedIn();
  }

  public logout() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.reset()
    );
  }

  reset() {
    this.userAuthService.clear();
    this.router.navigate(['/login']);

  }

}

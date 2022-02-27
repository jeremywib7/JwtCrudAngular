import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AppComponent} from "../../../app.component";

@Component({
  selector: 'app-menu',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();

  constructor(public appComponent: AppComponent) {
  }

  ngOnInit(): void {
  }

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }

}

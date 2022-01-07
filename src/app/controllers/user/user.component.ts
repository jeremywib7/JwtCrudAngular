import {Component, OnInit} from '@angular/core';
import {User} from "../../model/User";
import {MemberService} from "../../_services/member.service";
import {HttpErrorResponse} from "@angular/common/http";
import {countries} from "../../data/CountryData";
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {UserService} from "../../_services/user.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  p: number = 1;

  public countries: any = countries;
  selectedImage: File;
  orderHeader: String = 'userFirstName';

  ngOnInit(): void {
    this.getMembers();
    this.initForm();
  }

  initForm() {}

  public users: User[] | undefined;
  public editUsers: User | null | undefined;
  isDescOrder: boolean = true;

  constructor(private userService: UserService) {
  }

  public onSelectFile($event: Event) {
    this.selectedImage = ($event.target as HTMLInputElement).files[0];
  }

  public sort(headerName:String): void {
    this.isDescOrder = !this.isDescOrder;
    // this.orderHeader =  headerName;
  }

  public getMembers(): void {
    this.userService.getUsers().subscribe(
      (response: User[]) => {
        this.users = response;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      },
    );
  }

  public onOpenModal(member: User | null, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addMemberModal');
    }
    if (mode === 'edit') {
      this.editUsers = member;
      button.setAttribute('data-target', '#editMemberModal');
    }
    if (mode === 'delete') {
      button.setAttribute('data-target', '#deleteMemberModal');
    }
    container!.appendChild(button);
    button.click();
  }

  public onDeleteUser(username: string) {
    // this.userService.deleteMember(username).subscribe(res => {
    //   this.users = this.users.filter(user => user.username !== res.username);
    // });
  }

}

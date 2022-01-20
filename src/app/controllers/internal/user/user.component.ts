import {Component, OnInit} from '@angular/core';
import {User} from "../../../model/User";
import {HttpErrorResponse} from "@angular/common/http";
import {countries} from "../../../data/CountryData";
import {UserService} from "../../../_services/user.service";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  p: number = 1;
  apiBaseUrl = environment.apiBaseUrl;
  projectName = environment.project;

  public countries: any = countries;
  selectedImage: File;
  orderHeader: String = 'userFirstName';

  ngOnInit(): void {
    this.getMembers();
    this.initForm();
  }


  initForm() {
  }

  searchInput = {
    username: '', userFirstName: '', userLastName: '', email: '', gender: '', dateJoined: '',
    phoneNumber: '', address: '', imageUrl: '', userCode: '', bankAccount: '', role: {roleName: "", roleDescription: ""}
  };

  public users: User[] | undefined;
  public editUsers: User | null | undefined;
  isDescOrder: boolean = false;
  term: any;


  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
  }


  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  public onSelectFile($event: Event) {
    this.selectedImage = ($event.target as HTMLInputElement).files[0];
  }

  public sort(headerName: String): void {
    this.isDescOrder = !this.isDescOrder;
    this.orderHeader = headerName;
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
    this.userService.deleteUser(username).subscribe(res => {
      this.toastr.success('Delete User Success', 'Success');
      this.modalService.dismissAll();
      this.getMembers();
    });
  }


}

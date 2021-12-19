import {Component, OnInit} from '@angular/core';
import {Member} from "../../model/member";
import {MemberService} from "../../_services/member.service";
import {HttpErrorResponse} from "@angular/common/http";
import {countries} from "../../data/CountryData";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  public countries:any = countries;

  ngOnInit(): void {
    this.getMembers();
  }

  // @ts-ignore
  public members: Member[];

  constructor(private memberService: MemberService) {
  }

  public getMembers(): void {
    this.memberService.getMembers().subscribe(
      (response: Member[]) => {
        this.members = response;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      },
    );
  }

  public onOpenModal(member: Member | null, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addMemberModal');
    }
    if (mode === 'edit') {
      button.setAttribute('data-target', '#updateMemberModal');
    }
    if (mode === 'delete') {
      button.setAttribute('data-target', '#deleteMemberModal');
    }
    container!.appendChild(button);
    button.click();
  }

  public onAddMember(addForm: NgForm) :void {
    const closeModal = document.getElementById('add-member-form');
    closeModal!.click();

    this.memberService.addMember(addForm.value).subscribe(
      (response:Member) => {
        console.log(response);
        this.getMembers();
      },
      (error:HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

}

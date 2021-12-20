import {Component, OnInit} from '@angular/core';
import {Member} from "../../model/member";
import {DatePipe} from '@angular/common';
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

  public countries: any = countries;

  ngOnInit(): void {
    this.getMembers();
  }

  public members: Member[] | undefined;
  public editMember: Member | null | undefined;
  public formatDate1: any;

  constructor(
    private memberService: MemberService,
    public datepipe: DatePipe,
  ) {
  }

  formatDate(date?: string | undefined) {
    return this.datepipe.transform(date,'MM-dd-yyyy' );
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
      this.editMember = member;
      this.formatDate1 = this.formatDate(this.editMember?.dateJoined);
      button.setAttribute('data-target', '#editMemberModal');
    }
    if (mode === 'delete') {
      button.setAttribute('data-target', '#deleteMemberModal');
    }
    container!.appendChild(button);
    button.click();
  }

  public onAddMember(addForm: NgForm): void {
    const closeModal = document.getElementById('add-member-form');
    closeModal!.click();

    this.memberService.addMember(addForm.value).subscribe(
      (response: Member) => {
        console.log(response);
        this.getMembers();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onEditMember(editForm: any) {

  }
}

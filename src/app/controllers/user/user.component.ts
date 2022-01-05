import {Component, OnInit} from '@angular/core';
import {User} from "../../model/User";
import {MemberService} from "../../_services/member.service";
import {HttpErrorResponse} from "@angular/common/http";
import {countries} from "../../data/CountryData";
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  p: number = 1;

  public countries: any = countries;
  reactiveForm: any = FormGroup;
  selectedImage: File;

  ngOnInit(): void {
    this.getMembers();
    this.initForm();
  }

  initForm() {
    this.reactiveForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.compose(
        [Validators.pattern('[a-zA-z]*'), Validators.minLength(3)])]),
      firstName: new FormControl('', [Validators.required, Validators.compose(
        [Validators.pattern('[a-zA-z]*'), Validators.minLength(3)])]),
      lastName: new FormControl('', [Validators.required, Validators.compose(
        [Validators.pattern('[a-zA-z]*'), Validators.minLength(2)])]),
      email: new FormControl('', [Validators.required, Validators.compose(
        [Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')])]),
      gender: new FormControl('', [Validators.required]),
      dateJoined: new FormControl('', [Validators.required]),
      rank: new FormControl('', [Validators.required]),
      nationality: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required, Validators.compose(
        [Validators.pattern('[0-9+ ]*'), Validators.minLength(10), Validators.maxLength(14)])]),
      address: new FormControl('', [Validators.required]),
      imageUrl: new FormControl(null, [Validators.required]),
      bankAccount: new FormControl('', [Validators.required, Validators.compose(
        [Validators.pattern('[0-9+ ]*'), Validators.minLength(5), Validators.maxLength(20)])]),
    })}

  public members: User[] | undefined;
  public editMember: User | null | undefined;

  constructor(private memberService: MemberService) {
  }

  public onSelectFile($event: Event) {
    this.selectedImage = ($event.target as HTMLInputElement).files[0];
  }

  public getMembers(): void {
    this.memberService.getMembers().subscribe(
      (response: User[]) => {
        this.members = response;
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
      this.editMember = member;
      button.setAttribute('data-target', '#editMemberModal');
    }
    if (mode === 'delete') {
      button.setAttribute('data-target', '#deleteMemberModal');
    }
    container!.appendChild(button);
    button.click();
  }

  public onAddMember(addForm: FormGroup): void {
    if (addForm.valid) {
      console.log(addForm.value);
      this.reactiveForm.reset();
      const closeModal = document.getElementById('add-member-form');
      closeModal!.click();

      this.memberService.addMember(addForm.value).subscribe(
        (response: User) => {
          console.log(response);
          this.getMembers();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    } else {
      this.validateFormFields(addForm);
    }
  }

  public validateFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      let invalidFields = [].slice.call(document.getElementsByClassName('ng-invalid'));
      invalidFields[1].focus();
      if(control instanceof FormControl) {
        control.markAsTouched({onlySelf:true});
      } else if (control instanceof FormGroup) {
        this.validateFormFields(control);
      }
    })
  }

  public onEditMember(editForm: any) {

  }

}

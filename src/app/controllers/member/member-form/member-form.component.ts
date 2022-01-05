import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {countries} from "src/app/data/CountryData";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../../model/User";
import {MemberService} from "../../../_services/member.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.scss']
})
export class MemberFormComponent implements OnInit {

  editMode = false;

  public countries: any = countries;
  reactiveForm: any = FormGroup;
  selectedImage: File;
  public member: User | undefined;

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService) {
  }

  ngOnInit(): void {
    this.initForm();
    this.route.paramMap.subscribe(paramMap => {
        if (paramMap.has('username')) {
          this.editMode = true;
          this.memberService.getMemberByUsername(paramMap.get('username')).subscribe(
            (member: User) => {
              this.member = member;
              this.initForm();
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            }
          );
        } else {
          this.initForm();
        }
      }
    );
  }

  initForm() {
    this.reactiveForm = new FormGroup({
      userFirstName: new FormControl(this.member === null ? null : this.member?.userFirstName, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.compose(
          [Validators.pattern('[a-zA-z]*'), Validators.minLength(3)])]
      }),
      userLastName: new FormControl(this.member === null ? null : this.member?.userLastName, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.compose(
          [Validators.pattern('[a-zA-z]*'), Validators.minLength(2)])]
      }),
      email: new FormControl(this.member === null ? null : this.member?.email, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.compose(
          [Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')])]
      }),
      gender: new FormControl(this.member === null ? null : this.member?.gender, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateJoined: new FormControl(this.member === null ? null : this.member?.dateJoined,
        {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
      phoneNumber: new FormControl(this.member === null ? null : this.member?.phoneNumber,
        {
          updateOn: 'blur',
          validators: [Validators.required, Validators.compose(
            [Validators.pattern('[0-9+ ]*'), Validators.minLength(10),
              Validators.maxLength(14)])]
        }),
      address: new FormControl(this.member === null ? null : this.member?.address,
        {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
      imageUrl: new FormControl(this.member === null ? null : this.member?.imageUrl,
        {
          updateOn: 'blur',
          validators: [Validators.required]
        }
      ),
      bankAccount: new FormControl(this.member === null ? null : this.member?.bankAccount,
        {
          updateOn: 'blur',
          validators: [Validators.required, Validators.compose(
            [Validators.pattern('[0-9+ ]*'), Validators.minLength(5), Validators.maxLength(20)])]
        }
      ),
    })
  }

  public onSelectFile($event: Event) {
    this.selectedImage = ($event.target as HTMLInputElement).files[0];
  }

  public onAddMember(addForm: FormGroup): void {
    console.log("clicked")
  }

  public handleClick(): void {
  }

}

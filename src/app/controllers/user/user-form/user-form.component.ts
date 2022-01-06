import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {countries} from "src/app/data/CountryData";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../../model/User";
import {MemberService} from "../../../_services/member.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  editMode = true;
  reactiveForm: any = FormGroup;
  selectedImage: File;

  public countries: any = countries;
  public user: User | undefined;

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
            (user: User) => {
              this.user = user;
              this.initForm();
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            }
          );
        } else {
          this.editMode = false;
          this.initForm();
        }
      }
    );
  }

  initForm() {
    this.reactiveForm = new FormGroup({
      username: new FormControl(
        {value: this.user === null ? null : this.user?.username, disabled: this.editMode},  {
        updateOn: 'blur',
        validators: [Validators.required, Validators.compose(
          [Validators.minLength(3)])]
      }),
      userFirstName: new FormControl(this.user === null ? null : this.user?.userFirstName, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.compose(
          [Validators.pattern('[a-zA-z]*'), Validators.minLength(3)])]
      }),
      userLastName: new FormControl(this.user === null ? null : this.user?.userLastName, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.compose(
          [Validators.pattern('[a-zA-z]*'), Validators.minLength(2)])]
      }),
      email: new FormControl(this.user === null ? null : this.user?.email, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.compose(
          [Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')])]
      }),
      roleName: new FormControl(this.user === null ? null : this.user?.role[0].roleName, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      gender: new FormControl(this.user === null ? null : this.user?.gender, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateJoined: new FormControl(this.user === null ? null : this.user?.dateJoined,
        {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
      phoneNumber: new FormControl(this.user === null ? null : this.user?.phoneNumber,
        {
          updateOn: 'blur',
          validators: [Validators.required, Validators.compose(
            [Validators.pattern('[0-9+ ]*'), Validators.minLength(10),
              Validators.maxLength(14)])]
        }),
      address: new FormControl(this.user === null ? null : this.user?.address,
        {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
      imageUrl: new FormControl(this.user === null ? null : this.user?.imageUrl,
        {
          updateOn: 'blur',
          validators: [Validators.required]
        }
      ),
      bankAccount: new FormControl(this.user === null ? null : this.user?.bankAccount,
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

  }

  submit() {
    if (this.reactiveForm.invalid) {
      return;
    }

  }

}

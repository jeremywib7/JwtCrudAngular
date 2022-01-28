import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {countries} from "src/app/data/CountryData";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../../../model/User";
import {UserService} from "../../../../_services/user.service";
import {ToastrService} from "ngx-toastr";
import {DatePipe} from "@angular/common";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  //Main Config
  apiBaseUrl = environment.apiBaseUrl;
  projectName = environment.project;

  editMode = true;
  reactiveForm: any = FormGroup;
  selectedImage: File;

  public countries: any = countries;
  public user: User | undefined;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    public datepipe: DatePipe,
  ) {

  }

  ngOnInit(): void {
    this.initForm();
    this.route.paramMap.subscribe(paramMap => {
        if (paramMap.has('username')) {
          this.editMode = true;
          this.userService.getUserByUsername(paramMap.get('username')).subscribe(
            (user: User) => {
              this.user = user;
              this.initForm();
            },
          );
        } else {
          this.editMode = false;
          this.initForm();
        }
      }
    );
  }

  initForm() {
    this.reactiveForm = this.fb.group({
      username: new FormControl(
        this.user === null ? null : this.user?.username, {
          validators: [Validators.required, Validators.compose(
            [Validators.minLength(3)])]
        }),
      userFirstName: new FormControl(this.user === null ? null : this.user?.userFirstName, {
        validators: [Validators.required, Validators.compose(
          [Validators.pattern('[a-zA-z]*'), Validators.minLength(3)])]
      }),
      userLastName: new FormControl(this.user === null ? null : this.user?.userLastName, {
        validators: [Validators.required, Validators.compose(
          [Validators.pattern('[a-zA-z]*'), Validators.minLength(2)])]
      }),
      userPassword: new FormControl(this.user === null ? null : this.user?.userPassword, {}),
      email: new FormControl(this.user === null ? null : this.user?.email, {
        validators: [Validators.required, Validators.compose(
          [Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')])]
      }),
      role: this.fb.group({
        roleName: new FormControl(this.user === null ? null : this.user?.role.roleName, {
          validators: [Validators.required]
        }),
        roleDescription: new FormControl(this.user?.role.roleDescription, {}),
      }),
      gender: new FormControl(this.user === null ? null : this.user?.gender, {
        validators: [Validators.required]
      }),
      dateJoined: new FormControl(this.user === null ? null : this.user?.dateJoined,
        {
          validators: [Validators.required]
        }),
      phoneNumber: new FormControl(this.user === null ? null : this.user?.phoneNumber,
        {
          validators: [Validators.required, Validators.compose(
            [Validators.pattern('[0-9+ ]*'), Validators.minLength(10),
              Validators.maxLength(14)])]
        }),
      address: new FormControl(this.user === null ? null : this.user?.address,
        {
          validators: [Validators.required]
        }),
      userCode: new FormControl(this.user === null ? null : this.user?.userCode,
        {}),
      imageUrl: new FormControl(null,
        {
          validators: this.user ? [] : [Validators.required]
        }
      ),
      bankAccount: new FormControl(this.user === null ? null : this.user?.bankAccount,
        {
          validators: [Validators.required, Validators.compose(
            [Validators.pattern('[0-9+ ]*'), Validators.minLength(5), Validators.maxLength(20)])]
        }
      ),
    }, {updateOn: 'change'})
  }

  onSelectFile(event: Event) {
    this.selectedImage = (event.target as HTMLInputElement).files[0];
  }

  submit() {
    event.preventDefault();

    if (this.reactiveForm.valid) {

      this.reactiveForm.patchValue({
        userPassword: this.reactiveForm.value.userPassword,
        dateJoined: this.reactiveForm.value.dateJoined.length === 10 ?
          this.reactiveForm.value.dateJoined :
          this.datepipe.transform(this.reactiveForm.value.dateJoined,
            'dd/MM/yyyy'),
        role: {
          roleDescription: this.reactiveForm.value.role.roleName + " role"
        }
      });


      if (this.editMode === true) {

        this.reactiveForm.patchValue({
          imageUrl: this.user ? this.user.imageUrl : null,
        });

        this.userService.updateUser(this.reactiveForm.value, this.selectedImage).subscribe(
          (response: User) => {
            this.router.navigate(['/int/user']);
            this.toastr.success('User successfully updated', 'Success');
          },
        );

      } else {

        this.reactiveForm.patchValue({
          userPassword: "1234",
        });

        this.userService.addUser(this.reactiveForm.value, this.selectedImage).subscribe(
          (response: User) => {
            this.router.navigate(['/int/user']);
            this.toastr.success('User successfully registered', 'Success');
          },
        );

      }

    } else {
      this.validateFormFields(this.reactiveForm);
    }

  }

  public validateFormFields(formGroup: FormGroup) {

    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      let invalidFields = [].slice.call(document.getElementsByClassName('ng-invalid'));
      if ((invalidFields).length != 0) {
        invalidFields[1].focus();
      }
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateFormFields(control);
      }
    })
  }

}

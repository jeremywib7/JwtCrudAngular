import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {countries} from "src/app/data/CountryData";
import {Member} from "../../../model/member";
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

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.reactiveForm = new FormGroup({
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
    })
  }

  public onSelectFile($event: Event) {
    this.selectedImage = ($event.target as HTMLInputElement).files[0];
  }

  public onAddMember(addForm: FormGroup): void {

  }

}

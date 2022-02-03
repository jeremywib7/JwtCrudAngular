import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../../model/User";
import {Product} from "../../../../model/Product";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  reactiveForm: any = FormGroup;
  public product: Product | undefined;

  initForm() {
    this.reactiveForm = this.fb.group({
      name: new FormControl(
        this.product === null ? null : this.product?.name, {
          validators: [Validators.required, Validators.compose(
            [Validators.minLength(3)])]
        }),
      totalCalories: new FormControl(this.product === null ? null : this.product?.totalCalories, {
        validators: [Validators.required, Validators.compose(
          [Validators.pattern('[0-9+ ]*'), Validators.max(12345)])]
      }),
      active: new FormControl(this.product === null ? null : this.product?.active, {
        validators: [Validators.required]
      }),
      unitPrice: new FormControl(this.product === null ? null : this.product?.unitPrice, {
        validators: [Validators.required, Validators.compose(
          [Validators.pattern('[0-9+ ]*'), Validators.minLength(5), Validators.maxLength(20)])]
      }),
      discount: new FormControl(this.product === null ? null : this.product?.discount, {
        validators: [Validators.required]
      }),
      discountedPrice: new FormControl(this.product === null ? null : this.product?.discountedPrice, {
        validators: [Validators.required, Validators.compose(
          [Validators.pattern('[0-9+ ]*'), Validators.minLength(5), Validators.maxLength(20)])]
      }),
      description: new FormControl(this.product === null ? null : this.product?.description, {
        validators: [Validators.required]
      }),

      imageUrlMain: new FormControl(null,
        {
          validators: this.product ? [] : [Validators.required]
        }
      ),
      imageUrlSecondary: new FormControl(null,
        {
          validators: this.product ? [] : [Validators.required]
        }
      ),
      imageUrlThird: new FormControl(null,
        {
          validators: this.product ? [] : [Validators.required]
        }
      ),
    }, {updateOn: 'change'})
  }

  submit() {

  }


}

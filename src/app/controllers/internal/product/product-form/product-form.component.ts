import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../../model/User";
import {Product} from "../../../../model/Product";
import {ReactiveFormConfig, RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  constructor(
    private fb: RxFormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.initForm();

    ReactiveFormConfig.set({
      validationMessage: {
        required: 'This field is required',
        password: 'Input does not fulfil validation parameters',
      },
    });
  }

  reactiveForm: any = FormGroup;
  public product: Product | undefined;

  initForm() {
    this.reactiveForm = this.fb.group({
      name: new FormControl(
        this.product === null ? null : this.product?.name, RxwebValidators.required()),
      // totalCalories: new FormControl(this.product === null ? null : this.product?.totalCalories, {
      //   validators: [Validators.required, Validators.compose(
      //     [Validators.pattern('[0-9+ ]*'), Validators.max(12345)])]
      // }),
      // active: new FormControl(this.product === null ? null : this.product?.active, {
      //   validators: [Validators.required]
      // }),
      // unitPrice: new FormControl(this.product === null ? null : this.product?.unitPrice, {
      //   validators: [Validators.required, Validators.compose(
      //     [Validators.pattern('[0-9+ ]*'), Validators.minLength(5), Validators.maxLength(20)])]
      // }),
      // discount: new FormControl(this.product === null ? null : this.product?.discount, {
      //   validators: [Validators.required]
      // }),
      // discountedPrice: new FormControl(this.product === null ? null : this.product?.discountedPrice, {
      //   validators: [Validators.required, Validators.compose(
      //     [Validators.pattern('[0-9+ ]*'), Validators.min(123)])]
      // }),
      // description: new FormControl(this.product === null ? null : this.product?.description, {
      //   validators: [Validators.required]
      // }),
      // imageUrlMain: new FormControl(null,
      //   {
      //     validators: this.product ? [] : [Validators.required]
      //   }),
      // imageUrlSecondary: new FormControl(null,
      //   {
      //     validators: this.product ? [] : [Validators.required]
      //   }
      // ),
      // imageUrlThird: new FormControl(null,
      //   {
      //     validators: this.product ? [] : [Validators.required]
      //   }
      // ),
    });

    this.reactiveForm.patchValue({
      discount: "True",
    });

  }

  selectDiscountStatus() {
    if (this.reactiveForm.value.discount === "True") {
      this.reactiveForm.get("discountedPrice").enable();

      return "Enter discounted price";
    } else {
      this.reactiveForm.get("discountedPrice").disable();
      this.reactiveForm.patchValue({
        discountedPrice: null,
      });

      return "-";
    }
  }

  submit() {
  }

}

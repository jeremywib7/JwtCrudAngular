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

  unitPrice: number;

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
            [Validators.minLength(3), Validators.maxLength(10)])]
        }),
      totalCalories: new FormControl(this.product === null ? null : this.product?.totalCalories, {
        validators: [Validators.required, Validators.compose(
          [Validators.pattern('[0-9+ ]*'), Validators.max(12345)])]
      }),
      active: new FormControl(this.product === null ? null : this.product?.active, {
        validators: [Validators.required]
      }),
      unitPrice: new FormControl(this.product === null ? null : this.product?.unitPrice, {
        updateOn: 'change',
        validators: [Validators.required, Validators.compose(
          [Validators.pattern('[0-9+ ]*'), Validators.min(1000), Validators.max(1000000)])]
      }),
      discount: new FormControl(this.product === null ? null : this.product?.discount, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      discountedPrice: new FormControl(this.product === null ? null : this.product?.discountedPrice, {
        updateOn: 'change',
        validators: [Validators.required, Validators.compose(
          [Validators.pattern('[0-9+ ]*'), Validators.min(123),
            Validators.max(10000000)])]
      }),
      description: new FormControl(this.product === null ? null : this.product?.description, {
        validators: [Validators.required, Validators.compose(
          [Validators.minLength(20), Validators.maxLength(200)])]
      }),
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
    }, {updateOn: 'blur'});

    this.reactiveForm.patchValue({
      discount: "True",
    });

    //watch for unit price change
    const unitPrice = <FormControl>this.reactiveForm.get('unitPrice');
    const discountedPrice = <FormControl>this.reactiveForm.get('discountedPrice');

    unitPrice.valueChanges.subscribe(value => {
      discountedPrice.setValidators([Validators.required, Validators.compose(
        [Validators.pattern('[0-9+ ]*'), Validators.min(123),
          Validators.max(value)])]);
      discountedPrice.updateValueAndValidity();
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

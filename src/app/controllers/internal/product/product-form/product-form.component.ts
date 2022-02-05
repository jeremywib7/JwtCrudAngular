import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../../model/User";
import {Product} from "../../../../model/Product";
import {NumericValueType, ReactiveFormConfig, RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";
import {ProductService} from "../../../../_services/product.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {MatTableDataSource} from "@angular/material/table";
import {ProductCategory} from "../../../../model/ProductCategory";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  providers: [RxFormBuilder]
})
export class ProductFormComponent implements OnInit {

  constructor(
    private formBuilder: RxFormBuilder,
    private productService: ProductService,
    private router: Router,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.loadProductCategory();
  }

  reactiveForm: any = FormGroup;
  public product: Product | undefined;
  public category: ProductCategory | undefined;

  async loadProductCategory() {
    await this.productService.loadAllProductCategory().subscribe(
      (data: object) => {
        this.category = data['data'];
      },
    );
  }

  initForm() {
    this.reactiveForm = this.formBuilder.group({
      name: new FormControl(
        this.product === null ? null : this.product?.name, {
          validators: [RxwebValidators.required(),
            RxwebValidators.minLength({value: 3}), RxwebValidators.maxLength({value: 10})]
        }),
      totalCalories: new FormControl(this.product === null ? null : this.product?.totalCalories, {
        validators: [RxwebValidators.required(), RxwebValidators.numeric({
          acceptValue: NumericValueType.PositiveNumber
          , allowDecimal: false
        }), RxwebValidators.maxNumber({value: 10000})]
      }),
      active: new FormControl(this.product === null ? null : this.product?.active, {
        validators: []
      }),
      category: new FormControl(this.product === null ? null : this.product?.category, {
        validators: []
      }),
      unitPrice: new FormControl(this.product === null ? null : this.product?.unitPrice, {
        validators: [
          RxwebValidators.required(),
          RxwebValidators.numeric({
            acceptValue: NumericValueType.PositiveNumber, allowDecimal: false
          }),
          RxwebValidators.maxNumber({value: 1000000}),
          RxwebValidators.minNumber({value: 1})],
        asyncValidators: [
          RxwebValidators.greaterThanAsync({fieldName: 'discountedPrice'})]
      }),
      discount: new FormControl(this.product === null ? null : this.product?.discount, {
        validators: [RxwebValidators.required()]
      }),
      discountedPrice: new FormControl(this.product === null ? null : this.product?.discountedPrice, {
        validators: [
          RxwebValidators.required(),
        ],
        asyncValidators: [
          RxwebValidators.lessThanAsync({fieldName: 'unitPrice'})
        ]
      }),
      description: new FormControl(this.product === null ? null : this.product?.description, {
        updateOn: 'blur',
        validators: [RxwebValidators.required(), RxwebValidators.minLength({value: 20})]
      }),
      // imageUrlSecondary: new FormControl(null,
      //   {
      //     validators: this.product ? [] : [RxwebValidators.required()]
      //   }
      // ),
      // imageUrlThird: new FormControl(null,
      //   {
      //     validators: this.product ? [] : [RxwebValidators.required()]
      //   }
      // ),
    });

    const unitPrice = <FormControl>this.reactiveForm.get('unitPrice');
    const discountedPrice = <FormControl>this.reactiveForm.get('discountedPrice');

    //watch for unit price change
    unitPrice.valueChanges.subscribe(value => {
      discountedPrice.setAsyncValidators([RxwebValidators.lessThanAsync({fieldName: 'unitPrice',})]);
      unitPrice.setAsyncValidators([RxwebValidators.greaterThanAsync({fieldName: 'discountedPrice',})]);
      discountedPrice.updateValueAndValidity();
    });

    //set as true for selec html tag
    this.reactiveForm.patchValue({
      active: this.reactiveForm.value.active === null ? "true" : this.reactiveForm.value.active,
      discount: this.reactiveForm.value.discount === null ? "true" : this.reactiveForm.value.discount,
    });
  }

  submit() {
    if (this.reactiveForm.valid) {
      console.log("valid");
      this.productService.addProduct(this.reactiveForm.value).subscribe(
        (response: User) => {
          this.router.navigate(['/int/product/table']);
          this.toastr.success('Product successfully added', 'Success');
        },
      );
    } else {
      console.log("not valid");
      this.validateFormFields(this.reactiveForm);
    }
  }

  selectDiscountStatus() {
    if (this.reactiveForm.value.discount === "true") {
      this.reactiveForm.get("discountedPrice").enable();
    } else {
      this.reactiveForm.get("discountedPrice").disable();
      this.reactiveForm.patchValue({
        discountedPrice: null,
      });
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

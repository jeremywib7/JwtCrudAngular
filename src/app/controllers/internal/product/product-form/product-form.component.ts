import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../../model/User";
import {Product} from "../../../../model/Product";
import {
  NumericValueType,
  RxFormBuilder,
  RxwebValidators
} from "@rxweb/reactive-form-validators";
import {ProductService} from "../../../../_services/product.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ProductCategory} from "../../../../model/ProductCategory";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  providers: [RxFormBuilder]
})
export class ProductFormComponent implements OnInit {

  constructor(
    private rxFormBuilder: RxFormBuilder,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private ngbModal: NgbModal,
    private router: Router,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.loadProductCategory();
  }

  reactiveForm: any = FormGroup;
  imageForm: any = FormGroup;
  public products: Product | undefined;
  public categories: ProductCategory[];
  modalOption: NgbModalOptions = {}; // not null!

  imageSrc: string[] = [];
  selectedImage: File[] = [];

  async loadProductCategory() {
    await this.productService.loadAllProductCategory().subscribe(
      (data: object) => {
        this.categories = data['data'];

        //set default value as first array or true
        this.reactiveForm.patchValue({
          active: this.reactiveForm.value.active === null ? "true" : this.reactiveForm.value.active,
          category: {
            id: this.reactiveForm.value.category.id === null ? this.categories[0].id : this.reactiveForm.value.category.id
          },
          discount: this.reactiveForm.value.discount === null ? "true" : this.reactiveForm.value.discount,
        });
      },
    );
  }

  initForm() {
    this.reactiveForm = this.rxFormBuilder.group({
      name: [this.products === null ? null : this.products?.name,
        [
          RxwebValidators.required(),
          RxwebValidators.minLength({value: 3}),
          RxwebValidators.maxLength({value: 10})
        ]
      ],
      totalCalories: [this.products === null ? null : this.products?.totalCalories,
        [
          RxwebValidators.required(),
          RxwebValidators.numeric({
            acceptValue: NumericValueType.PositiveNumber
            , allowDecimal: false
          }),
          RxwebValidators.maxNumber({value: 10000})]
      ],
      active: [this.products === null ? null : this.products?.active],
      category: this.rxFormBuilder.group({
        id: [this.products === null ? null : this.products?.category]
      }),
      unitPrice: [this.products === null ? null : this.products?.unitPrice,
        [
          RxwebValidators.required(),
          RxwebValidators.numeric({
            acceptValue: NumericValueType.PositiveNumber, allowDecimal: false
          }),
          RxwebValidators.maxNumber({value: 1000000}),
          RxwebValidators.minNumber({value: 1}),
          RxwebValidators.greaterThan({fieldName: 'discountedPrice'})
        ],
      ],
      discount: [this.products === null ? null : this.products?.discount],
      discountedPrice: [this.products === null ? null : this.products?.discountedPrice,
        [
          RxwebValidators.required(),
          RxwebValidators.lessThan({fieldName: 'unitPrice'})
        ]],
      description: [this.products === null ? null : this.products?.description,
        [
          RxwebValidators.required(),
          RxwebValidators.minLength({value: 20})
        ]
      ],
      images: this.rxFormBuilder.array([{
        initialValue: [],
      }])
    });
    const imageArray = this.reactiveForm.get('images') as FormArray;
    imageArray.removeAt(0);

    const add = this.reactiveForm.get('images') as FormArray;
    add.push(this.rxFormBuilder.group({
      imageName: ['', RxwebValidators.required()],
    }));
  }


  addNewProductImage() {
    const imageNameArray = this.reactiveForm.get('images') as FormArray;
    let lastIndex = imageNameArray.length - 1;
    const lastImageName = imageNameArray.value[lastIndex].imageName;

    if (imageNameArray.length < 3 && lastImageName) {
      const add = this.reactiveForm.get('images') as FormArray;
      add.push(this.rxFormBuilder.group({
        imageName: ['', RxwebValidators.required()],
      }))
    }
  }

  isFirstImageArray(index: number): boolean {
    if (index === 0) {
      return false;
    } else {
      return true;
    }
  }

  deleteProductImage(index: number) {
    const imageArray = this.reactiveForm.get('images') as FormArray;
    if (imageArray.length > 1 && index != 0) {
      imageArray.removeAt(index);
      this.imageSrc.splice(index, 1);
      this.selectedImage.splice(index, 1);
    }

  }

  onImageChange(event: any, index: number): void {
    if (event.target.files && event.target.files[0]) {

      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageSrc[index] = e.target.result;
      };
      reader.readAsDataURL(file);
      this.selectedImage[index] = (event.target as HTMLInputElement).files[0];

      ((this.reactiveForm.get('images') as FormArray).at(index) as FormGroup).get('imageName').patchValue(
        event.target.files[0].name);
    }
  }

  onSaveImageClicked(content) {
    //prevent click outside modal and some settings
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.centered = true;
    this.modalOption.scrollable = true;

    this.ngbModal.open(content, this.modalOption);
  }

  submit() {
    if (this.reactiveForm.valid) {
      this.productService.addProduct(this.reactiveForm.value).subscribe(
        (response: User) => {
          this.router.navigate(['/int/product/table']);
          this.toastr.success('Product successfully added', 'Success');
        },
      );
    } else {
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

import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {Product} from "../../../../model/Product";
import {
  NumericValueType,
  RxFormBuilder,
  RxwebValidators
} from "@rxweb/reactive-form-validators";
import {ProductService} from "../../../../_services/product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ProductCategory} from "../../../../model/ProductCategory";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  providers: [RxFormBuilder]
})
export class ProductFormComponent implements OnInit {

  constructor(
    private rxFormBuilder: RxFormBuilder,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private ngbModal: NgbModal,
    private router: Router,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.initForm();
    await this.checkParamsExists();
    await this.loadProductCategory();
  }

  //Main Config
  apiBaseUrl = environment.apiBaseUrl;
  projectName = environment.project;

  editMode = true;

  images: FormArray;
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

  checkImagePreview(imagePreview: string, imageName: string) {
    if (imagePreview) {
      return false;
    }
    return  true;
  }

  checkParamsExists() {
    // check if param id exists, then load data if true and set edit mode to true
    if (this.activatedRoute.snapshot.queryParams['i']) {
      this.editMode = true;
      const idParam = this.activatedRoute.snapshot.queryParams['i'];

      let httpParams = new HttpParams();
      httpParams = httpParams.append('id', idParam);

      this.productService.loadProductDetailById(httpParams).subscribe(
        (product: Product) => {
          this.reactiveForm.patchValue({

            name: product['data'].name,
            discount: product['data'].discount,
            category: {
              id: product['data'].category.id
            },
            totalCalories: product['data'].totalCalories,
            description: product['data'].description,
            unitPrice: product['data'].unitPrice,
            discountedPrice: product['data'].discountedPrice,
            active: product['data'].active,
            createdOn: product['data'].createdOn
          });

          product['data'].images.forEach((element, index) => {
            this.images.push(this.rxFormBuilder.group({
              imageName: [element.imageName, RxwebValidators.required()],
            }))
          });

        },
      );
    } else {
      this.editMode = false;
      // add 1 value to the empty array
      this.images.push(this.rxFormBuilder.group({
        imageName: ['', RxwebValidators.required()],
      }));
    }
  }

  async initForm() {
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
    // clear images name array and add one
    this.images = this.reactiveForm.get('images') as FormArray;
    this.images.removeAt(0);
  }

  addNewProductImage() {
    let lastIndex = this.images.length - 1;
    const lastImageName = this.images.value[lastIndex].imageName;

    if (this.images.length < 3 && lastImageName) {
      this.images.push(this.rxFormBuilder.group({
        imageName: ['', RxwebValidators.required()],
      }))

    } else if (!lastImageName) {
      this.toastr.warning('Please add current image', 'No Image');
    } else if (this.images.length === 3) {
      this.toastr.warning('You can only upload maximum 3 images', 'Maximum Image');
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
    if (this.images.length > 1 && index != 0) {
      this.images.removeAt(index);
      this.imageSrc.splice(index, 1);
      this.selectedImage.splice(index, 1);
    }
  }

  onImageChange(event: any, index: number): void {
    // check if image not empty
    if (event.target.files && event.target.files[0]) {

      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // set image preview
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

  async submit() {
    if (this.reactiveForm.valid) {
      // set image name based on product name in for loop
      this.images.controls.forEach((element, index) => {
        const string = element.value.imageName;
        const dotIndex = string.lastIndexOf('.');
        const extension = string.substring(dotIndex);

        ((this.images).at(index) as FormGroup).get('imageName').patchValue(
          this.reactiveForm.value.name + "_" + index + extension);
      });

      // http post
      (await this.productService.addOrAndUpdateProduct(this.reactiveForm.value, this.selectedImage)).subscribe(
        (response) => {
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
        if (invalidFields[1]) {
          invalidFields[1].focus();
        } else {
          //  TODO open modal or show toastr
        }
      }

      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateFormFields(control);
      }
    })
  }

}

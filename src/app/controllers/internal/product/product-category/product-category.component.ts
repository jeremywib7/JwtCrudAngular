import {Component, OnInit} from '@angular/core';
import {NumericValueType, RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../../../_services/product.service";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {EMPTY} from "rxjs";
import {ProductCategory} from "../../../../model/ProductCategory";
import {FormControl, FormGroup} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {HttpParams} from "@angular/common/http";
import {Product} from "../../../../model/Product";
import {ProductCategoryService} from "../../../../_services/product-category.service";
import {select, Store} from "@ngrx/store";
import {allProductCategory} from "../../../../store/selectors/product-category.selector";
import {retrievedProductCategory} from "../../../../store/actions/product-category.actions";

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {

  constructor(
    private rxFormBuilder: RxFormBuilder,
    private toastr: ToastrService,
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private productCategoryService: ProductCategoryService,
    public ngbModal: NgbModal,
  ) {
  }

  // angular table
  displayedColumns: string[] = ['productName', 'delete'];
  dataSource!: MatTableDataSource<Product[]>; // for display data in table with sorting

  centeredStaticModal: NgbModalOptions = {}; // not null!
  reactiveForm: any = FormGroup;

  editMode: boolean = false;

  //from ngrx storage
  allProductCategories$ = this.store.pipe(select(allProductCategory()));

  //array models
  public productCategory: ProductCategory[];

  ngOnInit(): void {
    this.initForm();
    this.loadAllCategories().then(r => EMPTY);
    this.setModalSettings();
  }

  initForm() {
    this.reactiveForm = this.rxFormBuilder.group({
      categoryName: ['',
        [
          RxwebValidators.required(),
          RxwebValidators.minLength({value: 3}),
          RxwebValidators.maxLength({value: 10})
        ]
      ],
    });

  }

  setModalSettings() {
    //centered modal
    //prevent click outside modal and some settings
    this.centeredStaticModal.backdrop = 'static';
    this.centeredStaticModal.keyboard = false;
    this.centeredStaticModal.centered = true;
    this.centeredStaticModal.scrollable = true;
  }

  submit() {
    if (this.reactiveForm.valid) {
      if (this.editMode) {

      } else {
        this.productCategoryService.addProductCategory(this.reactiveForm.value).subscribe({
          next: value => {
            this.productCategory.push(value['data']);
          },
          complete: () => {

          }
        });
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
        if (invalidFields[1]) {
          invalidFields[1].focus();
        }
      }
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateFormFields(control);
      }
    })
  }


  async loadAllCategories() {
    this.allProductCategories$.subscribe(value => {
      this.productCategory = value;
    });

    this.productCategory.forEach(productCategory => {
      this.getTotalProductByCategory(productCategory);
    });
  }

  async getTotalProductByCategory(productCategory) {
    let params = new HttpParams();
    params = params.append("id", productCategory.id);

    this.productCategoryService.getTotalProductByCategory(params).subscribe({
      next: value => {
        productCategory.totalProduct = value['data']['totalProduct'];
      },
    });
  }

  loadProductBasedOnCategory(id?: string, modal?, editMode?: boolean, index?) {

    this.editMode = editMode;
    this.ngbModal.open(modal, this.centeredStaticModal);

    if (editMode) {
      this.reactiveForm.patchValue({
        categoryName: this.productCategory[index].categoryName
      });

      let params = new HttpParams();
      params = params.append('id', id);

      this.productCategoryService.loadProductsNameOnlyByCategory(params).subscribe({
        next: (product) => {
          this.dataSource = new MatTableDataSource(product['data']);
        }
      })
    } else {
      this.reactiveForm.reset();
    }

  }
}

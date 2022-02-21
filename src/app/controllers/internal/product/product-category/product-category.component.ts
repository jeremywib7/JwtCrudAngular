import {Component, OnInit, ViewChildren, ViewEncapsulation} from '@angular/core';
import {NumericValueType, RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbActiveModal, NgbModal, NgbModalOptions, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
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
  styleUrls: ['./product-category.component.css'],
})

export class ProductCategoryComponent implements OnInit {

  //modal
  centeredStaticModal: NgbModalOptions = {}; // not null!

  modalIndex: number = 0;
  modalCategoryId: string;
  modalCategoryName: string;
  //

  //for search
  searchCategory: any;
  //for filter sort asc or desc
  orderHeader: String = 'categoryName';
  isDescOrder: boolean = false;
  //for pagination
  p: number = 1;


  constructor(
    private rxFormBuilder: RxFormBuilder,
    private toastr: ToastrService,
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private productCategoryService: ProductCategoryService,
    public ngbModal: NgbModal
  ) {
  }

  // angular table
  displayedColumns: string[] = ['productName', 'delete'];
  dataSource!: MatTableDataSource<Product[]>; // for display data in table with sorting
  //

  //modal reference
  modalRef: any;

  reactiveForm: any = FormGroup;

  editMode: boolean = false;
  removeMode: boolean = false;

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
      id: [''],
      categoryName: ['',
        [
          RxwebValidators.required(),
          RxwebValidators.minLength({value: 3}),
          RxwebValidators.maxLength({value: 10})
        ]
      ],
      createdOn: [''],
      totalProduct: ['']
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

        this.productCategoryService.updateProductCategory(this.reactiveForm.value).subscribe({
          next: value => {
            this.productCategory[this.modalIndex] = value['data'];
            this.toastr.success("Success updated category");
            this.ngbModal.dismissAll();
          },
        });
      } else {
        this.productCategoryService.addProductCategory(this.reactiveForm.value).subscribe({
          next: value => {
            this.productCategory.push(value['data']);
            this.toastr.success("Success add category");
            this.ngbModal.dismissAll();
          },
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
    this.productCategoryService.loadProductCategories().subscribe({
      next: data => {
        this.store.dispatch(retrievedProductCategory({allProductCategory: data['data'] as ProductCategory[]}));
      },
    });

    this.allProductCategories$.subscribe({
      next: value => {
        this.productCategory = value;
      }
    });
  }

  openAddOrEditModal(id?: string, modal?, editMode?: boolean) {

    let itemIndex = this.productCategory.findIndex(productCategory => productCategory.id == id);
    this.modalIndex = itemIndex;

    this.editMode = editMode;
    this.modalRef = this.ngbModal.open(modal, this.centeredStaticModal);

    if (editMode) {
      this.reactiveForm.patchValue({
        id: id,
        categoryName: this.productCategory[itemIndex].categoryName,
        createdOn: this.productCategory[itemIndex].createdOn
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

  public sort(headerName: String): void {
    this.isDescOrder = !this.isDescOrder;
    this.orderHeader = headerName;
  }

  openDeleteModal(modal?, categoryId?: string) {

    if (categoryId) {
      let itemIndex = this.productCategory.findIndex(productCategory => productCategory.id == categoryId);
      this.modalIndex = itemIndex;
      this.modalCategoryId = categoryId;
      this.modalCategoryName = this.productCategory[itemIndex].categoryName;

    }

    this.ngbModal.open(modal);
  }

  deleteCategory() {
    this.productCategoryService.deleteProductCategory(this.modalCategoryId).subscribe({
      next: value => {
        this.productCategory.splice(this.modalIndex, 1);
        this.toastr.success("Delete category success");
      },
      complete: () => {
        this.ngbModal.dismissAll();
      }
    })
  }

  productName: string;
  openRemoveProductModal(removeProductModal, addOrEditModal, productName: string) {
    this.productName = productName;
    this.modalRef.close();

    this.modalRef = this.ngbModal.open(removeProductModal, {centered: true});

    this.modalRef.result.then((data) => {
      // on close
      this.modalRef = this.ngbModal.open(addOrEditModal, {centered: true});
    }, (reason) => {
      //on dismiss
      this.modalRef = this.ngbModal.open(addOrEditModal, {centered: true});
    });
  }

}

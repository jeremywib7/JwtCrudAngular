import {Component, OnInit, ViewChild, ViewChildren, ViewEncapsulation} from '@angular/core';
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
import {MatSort} from "@angular/material/sort";
import {UnassignedProduct} from "../../../../model/UnassignedProduct";
import {TableProduct} from "../../../../model/TableProduct";
import {ProductService} from "../../../../_services/product.service";

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

  displayRemoveProductModal: boolean = false;

  constructor(
    private rxFormBuilder: RxFormBuilder,
    private toastr: ToastrService,
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private productCategoryService: ProductCategoryService,
    private productService: ProductService,
    public ngbModal: NgbModal
  ) {
  }

  // angular table
  displayedColumns: string[] = ['name', 'delete'];
  dataSource: MatTableDataSource<TableProduct[]>; // for display data in table with sorting

  //for sorting table
  @ViewChild(MatSort) matSort: MatSort;
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
  public tableProducts: TableProduct[] = [];
  public unassignedProducts: UnassignedProduct[] = [];

  selectedCategory: string = "Unassigned"; //Id value of the City to be selected

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

    this.editMode = editMode;

    if (editMode) {
      let itemIndex = this.productCategory.findIndex(productCategory => productCategory.id === id);
      this.modalIndex = itemIndex;

      this.reactiveForm.patchValue({
        id: id,
        categoryName: this.productCategory[itemIndex].categoryName,
        createdOn: this.productCategory[itemIndex].createdOn
      });
    } else {
      this.reactiveForm.reset();
    }

    this.modalRef = this.ngbModal.open(modal, this.centeredStaticModal);

  }

  unassignedModal: boolean = false;

  openProductOnCatModal(id: string, modal) {
    let itemIndex = this.productCategory.findIndex(productCategory => productCategory.id === id);
    this.reactiveForm.patchValue({
      categoryName: this.productCategory[itemIndex].categoryName,
    });

    let params = new HttpParams();
    params = params.append('id', id);

    this.productCategoryService.loadProductsNameOnlyByCategory(params).subscribe({
      next: (data) => {
        this.tableProducts = data['data'];
      },
    });

    this.displayRemoveProductModal = true;


    // this.modalRef = this.ngbModal.open(modal, {centered: true, scrollable: false});
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

  productId: string;
  productName: string;
  productIndex: number;

  openRemoveProductModal(removeProductModal, addOrEditModal, productId: string) {
    let index = this.tableProducts.findIndex(product => product['id'] === productId);
    this.productName = this.tableProducts[index].name;

    this.productId = productId;
    this.displayRemoveProductModal = false;

    this.modalRef = this.ngbModal.open(removeProductModal, {centered: true});

    this.modalRef.result.then((data) => {
      // on closex
      this.displayRemoveProductModal = true;
      // this.modalRef = this.ngbModal.open(addOrEditModal, this.centeredStaticModal);
    }, (reason) => {
      //on dismiss
      this.displayRemoveProductModal = true;
      // this.modalRef = this.ngbModal.open(addOrEditModal, this.centeredStaticModal);
    });
  }


  removeProductInCategory() {
    let params = new HttpParams();
    params = params.append('pId', this.productId);

    this.productService.removeProductInCategory(params).subscribe({
      next: value => {
        this.tableProducts.splice(this.productIndex, 1);
        this.loadAllCategories().then(r => EMPTY);
        this.toastr.success("Remove product in category success");
      },
      complete: () => {
        this.ngbModal.dismissAll();
      }
    })
  }

  onCategorySelection(event, productId: string) {
    console.log(event);
    let itemIndex = this.tableProducts.findIndex(product => product['id'] === productId);
    this.tableProducts[itemIndex]['categoryId'] = event.value.id;
  }

  saveUnassignedProduct() {
    this.unassignedProducts = [];
    this.tableProducts.forEach((tableProductNCategory, index) => {
      if (tableProductNCategory['categoryId'] != undefined &&
        tableProductNCategory['categoryId'] != "akisjasas-asajek-ajsoaks-ejakjenafe") {
        this.unassignedProducts.push({
          productId: tableProductNCategory['id'],
          categoryId: tableProductNCategory['categoryId']
        })
      }
    });
    console.log(this.unassignedProducts);
  }

}

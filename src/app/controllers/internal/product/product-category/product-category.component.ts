import {Component, OnInit, ViewChild} from '@angular/core';
import {RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute} from "@angular/router";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {EMPTY} from "rxjs";
import {ProductCategory} from "../../../../model/ProductCategory";
import {FormControl, FormGroup} from "@angular/forms";
import {HttpParams} from "@angular/common/http";
import {ProductCategoryService} from "../../../../_services/product-category.service";
import {select, Store} from "@ngrx/store";
import {allProductCategory} from "../../../../store/selectors/product-category.selector";
import {retrievedProductCategory} from "../../../../store/actions/product-category.actions";
import {UnassignedProduct} from "../../../../model/UnassignedProduct";
import {TableProduct} from "../../../../model/TableProduct";
import {ProductService} from "../../../../_services/product.service";
import {ConfirmationService, MessageService} from "primeng/api";

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css'],
  providers: [ConfirmationService, MessageService]
})

export class ProductCategoryComponent implements OnInit {

  //for search
  searchCategory: any;
  //for filter sort asc or desc
  orderHeader: String = 'categoryName';
  isDescOrder: boolean = false;
  //for pagination
  p: number = 1;

  showProductListModal: boolean = false;
  showAddOrEditCatModal: boolean = false;
  private modalIndex: number;

  constructor(
    private rxFormBuilder: RxFormBuilder,
    private toastr: ToastrService,
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private productCategoryService: ProductCategoryService,
    private productService: ProductService,
    public ngbModal: NgbModal,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
  }

  reactiveForm: any = FormGroup;

  editMode: boolean = false;
  removeMode: boolean = false;

  //from ngrx storage
  allProductCategories$ = this.store.pipe(select(allProductCategory()));

  position: string;

  //array models
  public productCategory: ProductCategory[];
  public tableProducts: TableProduct[] = [];
  public unassignedProducts: UnassignedProduct[] = [];

  ngOnInit(): void {
    this.initForm();
    this.loadAllCategories().then(r => EMPTY);
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
    this.showAddOrEditCatModal = true;

    if (editMode) {
      let itemIndex = this.productCategory.findIndex(productCategory => productCategory.id === id);

      this.reactiveForm.patchValue({
        id: id,
        categoryName: this.productCategory[itemIndex].categoryName,
        createdOn: this.productCategory[itemIndex].createdOn
      });
    } else {
      this.reactiveForm.reset();
    }
    // this.modalRef = this.ngbModal.open(modal, this.centeredStaticModal);

  }

  unassignedModal: boolean = false;

  openProductOnCatModal(id: string) {

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
    this.showProductListModal = true;
  }

  public sort(headerName: String): void {
    this.isDescOrder = !this.isDescOrder;
    this.orderHeader = headerName;
  }

  openConfirmRemoveModal(productId: string, position: string) {
    this.position = position;

    let index = this.tableProducts.findIndex(product => product['id'] === productId);
    let params = new HttpParams();
    params = params.append('pId', productId);

    this.confirmationService.confirm({
      message: 'Remove product ' + this.tableProducts[index].name + ' ?',
      header: 'Confirm Removal',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.removeProductInCategory(params).subscribe({
          next: value => {
            this.tableProducts.splice(index, 1);
            this.loadAllCategories().then(r => EMPTY);
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'Remove product success!'});
          },
        });
      },
      reject: (type) => {
      }
    });
  }

  openConfirmDeleteModal(categoryId?: string) {
    let itemIndex = this.productCategory.findIndex(productCategory => productCategory.id == categoryId);

    this.confirmationService.confirm({
      message: 'Delete category ' + this.productCategory[itemIndex].categoryName + ' ?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productCategoryService.deleteProductCategory(categoryId).subscribe({
          next: value => {
            this.productCategory.splice(this.modalIndex, 1);
            this.loadAllCategories().then(r => EMPTY);
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'Remove product success!'});
          },
        });
      },
    });
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

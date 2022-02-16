import {Component, OnInit} from '@angular/core';
import {NumericValueType, RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../../../_services/product.service";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {EMPTY} from "rxjs";
import {ProductCategory} from "../../../../model/ProductCategory";
import {FormGroup} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {HttpParams} from "@angular/common/http";
import {Product} from "../../../../model/Product";

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {

  constructor(
    private rxFormBuilder: RxFormBuilder,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    public ngbModal: NgbModal,
  ) {
  }

  // angular table
  displayedColumns: string[] = ['productName', 'delete'];
  dataSource!: MatTableDataSource<Product[]>; // for display data in table with sorting

  public productCategory: ProductCategory[];

  centeredStaticModal: NgbModalOptions = {}; // not null!
  reactiveForm: any = FormGroup;

  editMode: boolean = false;

  ngOnInit(): void {
    this.initForm();
    this.loadAllCategories().then(r => EMPTY);
    this.setModalSettings();
  }

  initForm() {
    this.reactiveForm = this.rxFormBuilder.group({
      name: [this.productCategory === null ? null : this.productCategory,
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

  }

  async loadAllCategories() {
    this.productService.loadAllProductCategory().subscribe({
      next: async (productCategory) => {
        this.productCategory = productCategory['data'];
        this.productCategory.forEach(productCategory => {
          this.getTotalProductByCategory(productCategory);
        });
      },
    });
  }

  async getTotalProductByCategory(productCategory) {
    let params = new HttpParams();
    params = params.append("id", productCategory.id);

    await this.productService.getTotalProductByCategory(params).subscribe({
      next: value => {
        productCategory.totalProduct = value['data']['totalProduct'].toString();
      },
    });
  }

  loadProductBasedOnCategory(id?: string, modal?, editMode?: boolean, index?) {
    this.editMode = editMode;
    this.ngbModal.open(modal, this.centeredStaticModal);

    if (editMode) {
      this.reactiveForm.patchValue({
        name: this.productCategory[index].categoryName
      });

      let params = new HttpParams();
      params = params.append('id', id);

      this.productService.loadProductsNameOnlyByCategory(params).subscribe({
        next: (product) => {
          this.dataSource = new MatTableDataSource(product['data']);
        }
      })
    } else {
      this.reactiveForm.reset();
    }

  }
}

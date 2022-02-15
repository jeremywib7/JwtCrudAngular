import {Component, OnInit} from '@angular/core';
import {RxFormBuilder} from "@rxweb/reactive-form-validators";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../../../_services/product.service";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {EMPTY} from "rxjs";
import {ProductCategory} from "../../../../model/ProductCategory";
import {FormGroup} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {Product} from "../../../../model/Product";
import {HttpParams} from "@angular/common/http";

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
    private router: Router,
  ) {
  }

  // angular table
  displayedColumns: string[] = ['categoryName', 'delete'];
  dataSource!: MatTableDataSource<ProductCategory[]>; // for display data in table with sorting


  public productCategory: ProductCategory[];
  centeredStaticModal: NgbModalOptions = {}; // not null!
  reactiveForm: any = FormGroup;

  ngOnInit(): void {
    this.loadAllCategories().then(r => EMPTY);
    this.setModalSettings();
  }

  setModalSettings() {
    //centered modal
    //prevent click outside modal and some settings
    this.centeredStaticModal.backdrop = 'static';
    this.centeredStaticModal.keyboard = false;
    this.centeredStaticModal.centered = true;
    this.centeredStaticModal.scrollable = true;
  }

  async loadAllCategories() {
    await this.productService.loadAllProductCategory().subscribe({
      next: (productCategory) => {
        this.dataSource = new MatTableDataSource(productCategory['data']);
        this.productCategory = productCategory['data'];
      },
      error: error => {
      },
      complete: () => {
      },
    });
  }

  loadProductBasedOnCategory(id: string, modal) {
    this.ngbModal.open(modal, this.centeredStaticModal);

    let params = new HttpParams();

    params = params.append('id', id);

    this.productService.loadProductsNameOnlyByCategory(params).subscribe({
      next: value => {
        console.log(value);
      }
    })
  }

}

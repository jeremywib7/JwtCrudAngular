import {Component, OnInit} from '@angular/core';
import {RxFormBuilder} from "@rxweb/reactive-form-validators";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../../../_services/product.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EMPTY} from "rxjs";
import {ProductCategory} from "../../../../model/ProductCategory";

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
    private ngbModal: NgbModal,
    private router: Router,
  ) {
  }

  public productCategory: ProductCategory[];

  ngOnInit(): void {
    this.loadAllCategories().then(r => EMPTY);
  }


  async loadAllCategories() {
    await this.productService.loadAllProductCategory().subscribe({
      next: (productCategory) => {
        this.productCategory = productCategory['data'];
        console.log(this.productCategory);
      },
      error: error => {
      },
      complete: () => {
      },
    });
  }

}

import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../../_services/product.service";
import {Product} from "../../../model/Product";
import {select, Store} from "@ngrx/store";
import {retrievedProduct} from "../../../store/actions/product.actions";
import {productById} from "../../../store/selectors/product.selector";
import {ProductCategoryService} from "../../../_services/product-category.service";
import {retrievedProductCategory} from "../../../store/actions/product-category.actions";
import {ProductCategory} from "../../../model/ProductCategory";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-external-product',
  templateUrl: './external-product.component.html',
  styleUrls: ['./external-product.component.css']
})
export class ExternalProductComponent implements OnInit{

  productSelectedId = "all";
  allProduct$ = this.store.pipe(select(productById(this.productSelectedId)));

  constructor(
    private store: Store<{ product: Product[] }>,
    private _activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.listProducts();
  }

  listProducts() {
    const hasCategoryId: boolean = this._activatedRoute.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      +this._activatedRoute.snapshot.paramMap.get('id');
    }
  }

}

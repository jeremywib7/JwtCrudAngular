import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../../_services/product.service";
import {Product} from "../../../model/Product";
import {select, Store} from "@ngrx/store";
import {retrievedProduct} from "../../../store/actions/product.actions";
import {productById} from "../../../store/selectors/product.selector";
import {ProductCategoryService} from "../../../_services/product-category.service";
import {retrievedProductCategory} from "../../../store/actions/product-category.actions";
import {ProductCategory} from "../../../model/ProductCategory";

@Component({
  selector: 'app-external-product',
  templateUrl: './external-product.component.html',
  styleUrls: ['./external-product.component.css']
})
export class ExternalProductComponent  {

  productSelectedId = -1;
  allProduct$ = this.store.pipe(select(productById(this.productSelectedId)));

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    private store: Store<{ product: Product[] }>
  ) {
  }

  ngOnInit(): void {
    this.getlistProducts();
    this.getListProductCategories();
  }

  getlistProducts() {
    this.productService.loadProducts().subscribe(
      (data) => {
        this.store.dispatch(retrievedProduct({allProduct: data['data'] as Product[]}));
      },
    );
  }

  getListProductCategories() {
    this.productCategoryService.loadProductCategories().subscribe(
      (data) => {
        this.store.dispatch(retrievedProductCategory({allProductCategory: data['data'] as ProductCategory[]}));
      },
    );
  }

}

import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../../_services/product.service";
import {AppComponent} from "../../../app.component";
import {select, Store} from "@ngrx/store";
import {Product} from "../../../model/Product";
import {productById} from "../../../store/selectors/product.selector";
import {ProductCategory} from "../../../model/ProductCategory";
import {allProductCategory} from "../../../store/selectors/product-category.selector";

@Component({
  selector: 'app-header-external',
  templateUrl: './header.external.component.html',
  styleUrls: ['./header.external.component.css']
})
export class HeaderExternalComponent implements OnInit {

  //for store
  productSelectedId = -1;
  allProduct$ = this.store.pipe(select(productById(this.productSelectedId)));
  allProductCategories$ = this.store.pipe(select(allProductCategory()));

  //for autocomplete
  keyword: any = 'name';
  orderHeader: String = 'categoryName';


  constructor(
    // private productService: ProductService,
    private store: Store<{ product: Product[], productCategory: ProductCategory[] }>) {
  }

  ngOnInit(): void {
  }

}

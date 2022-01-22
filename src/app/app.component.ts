import { Component } from '@angular/core';
import {User} from "./model/User";
import {UserAuthService} from "./_services/user-auth.service";
import {Router} from "@angular/router";
import {UserService} from "./_services/user.service";
import {retrievedProduct} from "./store/actions/product.actions";
import {Product} from "./model/Product";
import {retrievedProductCategory} from "./store/actions/product-category.actions";
import {ProductCategory} from "./model/ProductCategory";
import {ProductService} from "./_services/product.service";
import {ProductCategoryService} from "./_services/product-category.service";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sideBarOpen: any = true;

  constructor(
    private userAuthService: UserAuthService,
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

  public roleInternal() {
    return this.userAuthService.isLoggedIn() && this.userAuthService.getRoles() != 'Customer';
  }

  public sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  public roleExternal() {
    return this.userAuthService.isLoggedIn() && this.userAuthService.getRoles() === 'Customer';
  }
}

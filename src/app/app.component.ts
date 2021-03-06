import {Component, Renderer2} from '@angular/core';
import {UserAuthService} from "./_services/user-auth.service";
import {Product} from "./model/Product";
import {retrievedProductCategory} from "./store/actions/product-category.actions";
import {ProductCategory} from "./model/ProductCategory";
import {ProductService} from "./_services/product.service";
import {ProductCategoryService} from "./_services/product-category.service";
import {Store} from "@ngrx/store";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sideBarOpen: any = true;
  productsPageNumber: number = 0;
  display: any;

  constructor(
    public renderer: Renderer2,
    private userAuthService: UserAuthService,
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    private store: Store<{ product: Product[] }>
  ) {
  }

  ngOnInit(): void {
    this.onInitMethod();

  }

  onInitMethod(): void {
    if (this.userAuthService.isLoggedIn()) {
      this.getListProductCategories();
    }
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

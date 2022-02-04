import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {AuthGuard} from "../../../_auth/auth.guard";
import {OrderModule} from "ngx-order-pipe";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {Attributes, IntersectionObserverHooks, LAZYLOAD_IMAGE_HOOKS, LazyLoadImageModule} from "ng-lazyload-image";
import {UserAuthService} from "../../../_services/user-auth.service";
import {ProductByCategoryComponent} from "./product-by-category.component";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {NgxSliderModule} from "@angular-slider/ngx-slider";
import {ProductDetailComponent} from "../product-detail/product-detail.component";
import {BrowserModule} from "@angular/platform-browser";
import {CurrencyMaskInputMode, NgxCurrencyModule} from "ngx-currency";

const routes: Routes = [
  {path: '', component: ProductByCategoryComponent, canActivate: [AuthGuard], data: {roles: 'Customer'}},
  {path: 'detail', component: ProductDetailComponent, canActivate: [AuthGuard], data: {roles: 'Customer'}},
];

export const customCurrencyMaskConfig = {
  align: "left",
  allowNegative: false,
  allowZero: true,
  decimal: ",",
  precision: 2,
  prefix: "R$ ",
  suffix: "",
  thousands: ".",
  nullable: true,
  min: null,
  max: null,
  inputMode: CurrencyMaskInputMode.FINANCIAL
};


@NgModule({
  declarations: [ProductByCategoryComponent],
  imports: [
    BrowserModule,
    CommonModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule,
    OrderModule,
    NgxSkeletonLoaderModule,
    NgxSliderModule,
    NgbModule,
    LazyLoadImageModule,
  ],
  providers: [{provide: LAZYLOAD_IMAGE_HOOKS, useClass: ProductByCategoryModule}],

})

export class ProductByCategoryModule extends IntersectionObserverHooks {

  constructor(private userAuthService: UserAuthService) {
    super();
  }

  //to load image with token
  override loadImage({imagePath}: Attributes): Promise<string> {
    return fetch(imagePath, {
      headers: {
        Authorization: 'Bearer ' + this.userAuthService.getToken(),
      },
    })
      .then((res) => res.blob())
      .then((blob) => URL.createObjectURL(blob));
  }
}

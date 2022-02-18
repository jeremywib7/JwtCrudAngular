import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './controllers/both/home/home.component';
import {AdminComponent} from './controllers/internal/admin/admin.component';
import {LoginComponent} from './controllers/both/login/login.component';
import {ForbiddenComponent} from './controllers/ui/forbidden/forbidden.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "./_auth/auth.guard";
import {AuthInterceptor} from "./_auth/auth.interceptor";
import {UserService} from "./_services/user.service";
import {DatePipe} from "@angular/common";
import {SidenavComponent} from './controllers/ui/sidenav/sidenav.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

//library section

import {Attributes, IntersectionObserverHooks, LazyLoadImageModule} from 'ng-lazyload-image'; // <-- import it
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {AngularToastifyModule} from "angular-toastify";
import {ToastContainerModule, ToastrModule} from "ngx-toastr";
import {CookieService} from "ngx-cookie-service";
import {ProductService} from "./_services/product.service";
import {InternalProductComponent} from "./controllers/internal/product/product.component";
import {HeaderExternalComponent} from "./controllers/ui/header.external/header.external.component";
import {ExternalProductComponent} from "./controllers/external/homepage/external-product.component";
import {InternalHeaderComponent} from "./controllers/ui/header.internal/header.component";
import {FooterExternalComponent} from './controllers/ui/footer-external/footer-external.component';
import {Store, StoreModule} from "@ngrx/store";
import {productReducer} from "./store/reducers/product.reducer";
import {productCategoryReducer} from "./store/reducers/product-category.reducer";
import { ProductDetailComponent } from './controllers/external/product-detail/product-detail.component';
import {CurrencyMaskInputMode, NgxCurrencyModule} from "ngx-currency";
import {RxReactiveFormsModule} from "@rxweb/reactive-form-validators";


export const customCurrencyMaskConfig = {
  align: "left",
  allowNegative: false,
  allowZero: true,
  decimal: ",",

  //to set extra decimal
  precision: 0,

  prefix: "Rp. ",
  suffix: "",
  thousands: ".",
  nullable: true,
  min: null,
  max: null,
  inputMode: CurrencyMaskInputMode.FINANCIAL
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    LoginComponent,
    ForbiddenComponent,
    InternalHeaderComponent,
    SidenavComponent,
    ExternalProductComponent,
    HeaderExternalComponent,
    FooterExternalComponent,
    ProductDetailComponent,
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RxReactiveFormsModule,
    AngularToastifyModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    ToastrModule.forRoot({
      timeOut: 5000,
      // positionClass: 'toast-bottom-left',
    }),
    AutocompleteLibModule,
    ToastContainerModule,
    LazyLoadImageModule,
    FormsModule,
    HttpClientModule,
    RouterModule,

    // * MATERIAL IMPORTS
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,

    // NGRX STORE
    StoreModule.forRoot({product: productReducer, productCategory: productCategoryReducer}
      , {
        runtimeChecks: {
          strictStateImmutability: false  ,
          strictActionImmutability: false,
          strictStateSerializability: true,
          strictActionSerializability: true
        }
      }),
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    DatePipe,
    CookieService,
    UserService,
    ProductService,
    Store
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}

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
import {ButtonModule} from "../../projects/components/button/src/lib/button.module";
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {NgxPaginationModule} from "ngx-pagination";
import {UserFormComponent} from "./controllers/internal/user/user-form/user-form.component";
import {FilterPipeModule} from 'ngx-filter-pipe';
import {AngularToastifyModule} from "angular-toastify";
import {ToastContainerModule, ToastrModule} from "ngx-toastr";
import {OrderModule} from "ngx-order-pipe";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {CookieService} from "ngx-cookie-service";
import {ProductService} from "./_services/product.service";
import {InternalProductComponent} from "./controllers/internal/product/product.component";
import {HeaderExternalComponent} from "./controllers/ui/header.external/header.external.component";
import {ExternalProductComponent} from "./controllers/external/external-product/external-product.component";
import {InternalHeaderComponent} from "./controllers/ui/header.internal/header.component";
import { FooterExternalComponent } from './controllers/ui/footer-external/footer-external.component';
import {Store, StoreModule} from "@ngrx/store";
import {productReducer} from "./store/reducers/product.reducer";
import {productCategoryReducer} from "./store/reducers/product-category.reducer";
import { PageNotFoundComponent } from './controllers/both/page-not-found/page-not-found.component';
import {
  ExternalProductByCategoryComponent
} from "./controllers/external/product-by-category/product-by-category.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    LoginComponent,
    ForbiddenComponent,
    InternalHeaderComponent,
    SidenavComponent,
    UserFormComponent,
    ExternalProductComponent,
    InternalProductComponent,
    HeaderExternalComponent,
    FooterExternalComponent,
    PageNotFoundComponent,
    ExternalProductByCategoryComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularToastifyModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      // positionClass: 'toast-bottom-left',
    }),
    AutocompleteLibModule,
    ToastContainerModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    NgxPaginationModule,
    NgbModule,
    Ng2SearchPipeModule,
    // * MATERIAL IMPORTS
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    // Components
    OrderModule,
    ButtonModule,
    FilterPipeModule,
    NgbModule,
    StoreModule.forRoot({product:productReducer, productCategory: productCategoryReducer}),
    BsDatepickerModule.forRoot(),
  ],
  providers: [
    AuthGuard, {
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

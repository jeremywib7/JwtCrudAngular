import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {InternalProductComponent} from "./product.component";
import {AuthGuard} from "../../../_auth/auth.guard";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {Attributes, IntersectionObserverHooks, LAZYLOAD_IMAGE_HOOKS, LazyLoadImageModule} from "ng-lazyload-image";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatSelectModule} from "@angular/material/select";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {UserAuthService} from "../../../_services/user-auth.service";
import {MatDialogModule} from "@angular/material/dialog";
import {ProductFormComponent} from './product-form/product-form.component';
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatTabsModule} from "@angular/material/tabs";
import {ProductCategoryComponent} from './product-category/product-category.component';
import {ProductTableComponent} from './product-table/product-table.component';
import {NgxCurrencyModule} from "ngx-currency";
import {MatSnackBarModule} from "@angular/material/snack-bar";

const routes: Routes = [
  {
    path: '',
    component: InternalProductComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['Admin']
    },
    children: [
      {path: '', redirectTo: 'table'},
      {
        path: 'table',
        component: ProductTableComponent,
        canActivate: [AuthGuard],
        data: {
          roles: ['Admin'],
          label: 'Product'
        }
      },
      {
        path: 'category',
        component: ProductCategoryComponent,
        canActivate: [AuthGuard],
        data: {
          roles: ['Admin'],
          label: 'Category'
        }
      },
    ]
  },

  {path: 'add', component: ProductFormComponent, canActivate: [AuthGuard], data: {roles: ['Admin']}}
];

@NgModule({
  declarations: [InternalProductComponent, ProductFormComponent, ProductCategoryComponent, ProductTableComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    LazyLoadImageModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    MatAutocompleteModule,
    MatTabsModule,
    NgbModule,
    NgxCurrencyModule
  ],
  providers: [
    {provide: LAZYLOAD_IMAGE_HOOKS, useClass: InternalProductModule},
  ],
})


export class InternalProductModule extends IntersectionObserverHooks {

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

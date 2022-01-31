import {Injectable, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {NgxPaginationModule} from "ngx-pagination";
import {InternalProductComponent} from "./product.component";
import {AuthGuard} from "../../../_auth/auth.guard";
import {UserComponent} from "../user/user.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {OrderModule} from "ngx-order-pipe";
import {Ng2SearchPipeModule} from "ng2-search-filter";
import {LAZYLOAD_IMAGE_HOOKS, LazyLoadImageModule} from "ng-lazyload-image";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatSelectModule} from "@angular/material/select";
import {MatPaginatorModule} from "@angular/material/paginator";

const routes: Routes = [
  {path: '', component: InternalProductComponent, canActivate: [AuthGuard], data: {roles: ['Admin']}}
];

@NgModule({
  declarations: [InternalProductComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    NgxPaginationModule,
    OrderModule,
    Ng2SearchPipeModule,
    LazyLoadImageModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    MatPaginatorModule
  ],
  providers: [{provide: LAZYLOAD_IMAGE_HOOKS, useClass: InternalProductModule}],
})


export class InternalProductModule {
}

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from "@angular/common";
import {UserComponent} from "./user.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {AuthGuard} from "../../../_auth/auth.guard";
import {NgxPaginationModule} from "ngx-pagination";
import {UserFormComponent} from './user-form/user-form.component';
import {OrderModule} from "ngx-order-pipe";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {Ng2SearchPipeModule} from "ng2-search-filter";
import {Attributes, IntersectionObserverHooks, LAZYLOAD_IMAGE_HOOKS, LazyLoadImageModule} from "ng-lazyload-image";
import {UserAuthService} from "../../../_services/user-auth.service";

const routes: Routes = [
  {path: '', component: UserComponent, canActivate: [AuthGuard], data: {roles: 'Admin'}},
  {
    path: 'add',
    loadChildren: () => import('./user-form/user-form.module').then(x => x.UserFormModule),
    canActivate: [AuthGuard], data: {roles: 'Admin'}
  },
  {
    path: ':username',
    loadChildren: () => import('./user-form/user-form.module').then(x => x.UserFormModule),
    canActivate: [AuthGuard], data: {roles: 'Admin'}
  }
];

@NgModule({
  declarations: [UserComponent],
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
  ],
  providers: [{provide: LAZYLOAD_IMAGE_HOOKS, useClass: UserModule}],

})

export class UserModule extends IntersectionObserverHooks {

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

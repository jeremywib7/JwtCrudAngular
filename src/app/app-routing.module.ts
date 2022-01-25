import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./controllers/both/home/home.component";
import {AdminComponent} from "./controllers/internal/admin/admin.component";
import {LoginComponent} from "./controllers/both/login/login.component";
import {ForbiddenComponent} from "./controllers/ui/forbidden/forbidden.component";
import {AuthGuard} from "./_auth/auth.guard";
import {InternalProductComponent} from "./controllers/internal/product/product.component";
import {ExternalProductComponent} from "./controllers/external/external-product/external-product.component";
import {PageNotFoundComponent} from "./controllers/both/page-not-found/page-not-found.component";
import {ExternalProductByCategoryComponent} from "./controllers/external/product-by-category/product-by-category.component";

// @ts-ignore
const routes: Routes = [
  // {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: {roles: 'All'}},
  {path: 'login', component: LoginComponent},
  {path: 'forbidden', component: ForbiddenComponent},

  // internal
  {path: 'int/product', component: InternalProductComponent, canActivate: [AuthGuard], data: {roles: ['Admin']}},
  {
    path: 'int/user',
    loadChildren: () => import('./controllers/internal/user/user.module').then(x => x.UserModule),
    canActivate: [AuthGuard],
    data: {roles: 'Admin'}
  },
  {path: 'int/admin', component: AdminComponent, canActivate: [AuthGuard], data: {roles: 'Admin'}},


  // external
  {path: 'ext/product', component: ExternalProductComponent, canActivate: [AuthGuard], data: {roles: ['Customer']}},
  {path: '', component: ExternalProductComponent, canActivate: [AuthGuard], data: {roles: ['Customer']}},
  {
    path: 'ext/category/filter',
    component: ExternalProductByCategoryComponent,
    canActivate: [AuthGuard],
    data: {roles: ['Customer']}
  },

  {
    path: 'page-not-found',
    component: PageNotFoundComponent
  },
  {path: '**', component: PageNotFoundComponent, canActivate: [AuthGuard], data: {roles: ['All']}},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

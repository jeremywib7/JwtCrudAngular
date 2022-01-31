import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./controllers/both/home/home.component";
import {AdminComponent} from "./controllers/internal/admin/admin.component";
import {LoginComponent} from "./controllers/both/login/login.component";
import {ForbiddenComponent} from "./controllers/ui/forbidden/forbidden.component";
import {AuthGuard} from "./_auth/auth.guard";
import {InternalProductComponent} from "./controllers/internal/product/product.component";
import {ExternalProductComponent} from "./controllers/external/homepage/external-product.component";
import {PageNotFoundComponent} from "./controllers/both/page-not-found/page-not-found.component";

// @ts-ignore
const routes: Routes = [
  // {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: {roles: 'All'}},
  {path: 'login', component: LoginComponent},
  {path: 'forbidden', component: ForbiddenComponent},

  // internal
  {
    path: 'int/product',
    loadChildren: () => import('./controllers/internal/product/product.module').then(x => x.InternalProductModule),
    canActivate: [AuthGuard],
    data: {roles: 'Admin'}
  },
  {
    path: 'int/user',
    loadChildren: () => import('./controllers/internal/user/user.module').then(x => x.UserModule),
    canActivate: [AuthGuard],
    data: {roles: 'Admin'}
  },
  {path: 'int/admin', component: AdminComponent, canActivate: [AuthGuard], data: {roles: 'Admin'}},


  // external
  {path: '', component: ExternalProductComponent, canActivate: [AuthGuard], data: {roles: ['Customer']}},
  {
    path: 'ext/product',
    loadChildren: () => import('./controllers/external/product-by-category/product-by-category.module').then(x =>
      x.ProductByCategoryModule),
    canActivate: [AuthGuard],
    data: {roles: 'Customer'}
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

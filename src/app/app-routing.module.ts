import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./controllers/both/home/home.component";
import {AdminComponent} from "./controllers/internal/admin/admin.component";
import {UserComponent} from "./controllers/internal/user/user.component";
import {LoginComponent} from "./controllers/both/login/login.component";
import {ForbiddenComponent} from "./controllers/ui/forbidden/forbidden.component";
import {AuthGuard} from "./_auth/auth.guard";
import {ProductComponent} from "./controllers/internal/product/product.component";

// @ts-ignore
const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: {roles: 'All'}},
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: {roles: 'Admin'}},
  {path: 'admin/product', component: ProductComponent, canActivate: [AuthGuard], data: {roles: 'Admin'}},

  // {
  //   path: 'admin/product',
  //   loadChildren: () => import('./controllers/member/member.module').then(x => x.MemberModule),
  //   canActivate: [AuthGuard],
  //   data: {roles: 'Admin'}
  // },
  {
    path: 'user',
    loadChildren: () => import('./controllers/internal/user/user.module').then(x => x.UserModule),
    canActivate: [AuthGuard],
    data: {roles: 'Admin'}
  },
  {path: 'login', component: LoginComponent},
  {path: 'forbidden', component: ForbiddenComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

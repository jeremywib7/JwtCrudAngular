import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./controllers/home/home.component";
import {AdminComponent} from "./controllers/admin/admin.component";
import {UserComponent} from "./controllers/user/user.component";
import {LoginComponent} from "./controllers/login/login.component";
import {ForbiddenComponent} from "./controllers/ui/forbidden/forbidden.component";
import {AuthGuard} from "./_auth/auth.guard";

// @ts-ignore
const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: {roles: 'All'}},
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: {roles: 'Admin'}},
  {
    path: 'member',
    loadChildren: () => import('./controllers/member/member.module').then(x => x.MemberModule),
    canActivate: [AuthGuard],
    data: {roles: 'Admin'}
  },
  {
    path: 'user',
    loadChildren: () => import('./controllers/user/user.module').then(x => x.UserModule),
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

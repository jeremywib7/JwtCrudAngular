import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./controllers/home/home.component";
import {AdminComponent} from "./controllers/admin/admin.component";
import {UserComponent} from "./controllers/user/user.component";
import {LoginComponent} from "./controllers/login/login.component";
import {ForbiddenComponent} from "./controllers/forbidden/forbidden.component";
import {AuthGuard} from "./_auth/auth.guard";
import {MemberComponent} from "./controllers/member/member.component";

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: {roles: ['Admin']}},
  {path: 'member', component: MemberComponent},
  {path: 'user', component: UserComponent, canActivate: [AuthGuard], data: {roles: ['User']}},
  {path: 'login', component: LoginComponent},
  {path: 'forbidden', component: ForbiddenComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

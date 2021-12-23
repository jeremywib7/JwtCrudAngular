import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from "@angular/common";
import {MemberComponent} from "./member.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MemberFormComponent} from "./member-form/member-form.component";
import {AuthGuard} from "../../_auth/auth.guard";

const routes: Routes = [
  {path: '', component: MemberComponent, canActivate: [AuthGuard], data: {roles: ['Admin']}},
  {
    path: 'add',
    component: MemberFormComponent, canActivate: [AuthGuard], data: {roles: ['Admin']}},
  {
    path: ':id',
    component: MemberFormComponent, canActivate: [AuthGuard], data: {roles: ['Admin']}},
];

@NgModule({
  declarations: [MemberComponent,],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule]
})
export class MemberModule {
}

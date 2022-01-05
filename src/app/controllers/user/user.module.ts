import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from "@angular/common";
import {UserComponent} from "./user.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {AuthGuard} from "../../_auth/auth.guard";
import {NgxPaginationModule} from "ngx-pagination";
import { UserFormComponent } from './user-form/user-form.component';

const routes: Routes = [
  {path: '', component: UserComponent, canActivate: [AuthGuard], data: {roles: ['Admin']}},
  {
    path: 'add',
    component: UserFormComponent, canActivate: [AuthGuard], data: {roles: ['Admin']}},
  {
    path: ':username',
    component: UserFormComponent, canActivate: [AuthGuard], data: {roles: ['Admin']}}
];

@NgModule({
  declarations: [UserComponent,],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        NgxPaginationModule
    ]
})

export class UserModule {
}
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from "@angular/common";
import {MemberComponent} from "./member.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MemberFormComponent} from "./member-form/member-form.component";

const routes: Routes = [
  {path: '', component: MemberComponent},
  {
    path: 'new',
    component: MemberFormComponent
  },
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

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserFormComponent} from "./user-form.component";
import {CommonModule} from "@angular/common";
import {ToastContainerModule, ToastrModule} from "ngx-toastr";

const routes: Routes = [
  {path: '', component: UserFormComponent},
];

@NgModule({
  declarations: [UserFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class UserFormModule {
}

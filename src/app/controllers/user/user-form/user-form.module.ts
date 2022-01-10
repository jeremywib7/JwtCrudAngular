import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserFormComponent} from "./user-form.component";
import {CommonModule} from "@angular/common";
import {ToastContainerModule, ToastrModule} from "ngx-toastr";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {Ng2BootstrapModule} from "ng-bootstrap";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {DatepickerModule} from "ng2-datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";

const routes: Routes = [
  {path: '', component: UserFormComponent},
];

@NgModule({
  declarations: [UserFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    BsDatepickerModule.forRoot()
  ],
})
export class UserFormModule {
}

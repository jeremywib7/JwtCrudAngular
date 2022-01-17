import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserFormComponent} from "./user-form.component";
import {CommonModule, DatePipe} from "@angular/common";
import {NgbButtonsModule, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";

const routes: Routes = [
  {path: '', component: UserFormComponent},
];

@NgModule({
  declarations: [UserFormComponent ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class UserFormModule {
}

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MemberFormComponent} from "./member-form.component";
import {CommonModule} from "@angular/common";

const routes: Routes = [
  {path: '', component: MemberFormComponent},
];

@NgModule({
  declarations: [MemberFormComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class MemberFormModule {
}

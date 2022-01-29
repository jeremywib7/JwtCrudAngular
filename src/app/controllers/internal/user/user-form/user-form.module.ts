import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserFormComponent} from "./user-form.component";
import {CommonModule, DatePipe} from "@angular/common";
import {NgbButtonsModule, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {Attributes, IntersectionObserverHooks, LAZYLOAD_IMAGE_HOOKS, LazyLoadImageModule} from "ng-lazyload-image";
import {UserAuthService} from "../../../../_services/user-auth.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {NgxPaginationModule} from "ngx-pagination";
import {Ng2SearchPipeModule} from "ng2-search-filter";
import {OrderModule} from "ngx-order-pipe";
import {ButtonModule} from "../../../../../../projects/components/button/src/lib/button.module";

const routes: Routes = [
  {path: '', component: UserFormComponent},
];

@NgModule({
  declarations: [UserFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    HttpClientModule,
    NgbModule,
    NgxPaginationModule,
    OrderModule,
    Ng2SearchPipeModule,
    LazyLoadImageModule,
    BsDatepickerModule.forRoot(),
  ],
  providers: [{provide: LAZYLOAD_IMAGE_HOOKS, useClass: UserFormModule}],
})
export class UserFormModule extends IntersectionObserverHooks {

  constructor(private userAuthService: UserAuthService) {
    super();
  }

  //to load image with token
  override loadImage({imagePath}: Attributes): Promise<string> {
    return fetch(imagePath, {
      headers: {
        Authorization: 'Bearer ' + this.userAuthService.getToken(),
      },
    })
      .then((res) => res.blob())
      .then((blob) => URL.createObjectURL(blob));
  }


}

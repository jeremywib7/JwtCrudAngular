import { NgModule } from "@angular/core";
import {SecurePipe} from "./SecurePipe";

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [
    SecurePipe
  ],
  exports: [
    SecurePipe
  ]
})
export class ApplicationPipesModule {}

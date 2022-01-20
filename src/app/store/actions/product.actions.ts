import {createAction, props} from '@ngrx/store';
import {Product} from "../../model/Product";

export const retrievedProduct = createAction(
  '[Product API] API Success',
  props<{allProduct: Product[]}>()
)


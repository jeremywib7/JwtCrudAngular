import {createAction, props} from "@ngrx/store";
import {ProductCategory} from "../../model/ProductCategory";

export const retrievedProductCategory = createAction(
  '[ProductCategory API] API Success',
  props<{allProductCategory: ProductCategory[]}>()
);

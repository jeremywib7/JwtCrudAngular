import {createSelector} from '@ngrx/store';
import {AppState} from "../app.state";
import {ProductCategory} from "../../model/ProductCategory";

export const productCategoryRootSelector = (state:AppState) => state.productCategory;

export const allProductCategory = () =>
  createSelector(productCategoryRootSelector, (product: ProductCategory[]) => {
    return product;
  });




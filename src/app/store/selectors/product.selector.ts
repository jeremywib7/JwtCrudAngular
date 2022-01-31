import {createSelector} from '@ngrx/store';
import {AppState} from "../app.state";
import {Product} from "../../model/Product";

export const productRootSelector = (state:AppState) => state.product;

export const productById = (productId: string) =>
  createSelector(productRootSelector, (product: Product[]) => {
    if (productId === "all") {
      return product;
    }

    return product.filter((_) => _.id === productId);
  })




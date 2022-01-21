import {createSelector} from '@ngrx/store';
import {AppState} from "../app.state";
import {Product} from "../../model/Product";

export const productRootSelector = (state:AppState) => state.product;

export const productById = (productId: number) =>
  createSelector(productRootSelector, (product: Product[]) => {
    if (productId === -1) {
      return product;
    }

    return product.filter((_) => _.id === productId);
  })




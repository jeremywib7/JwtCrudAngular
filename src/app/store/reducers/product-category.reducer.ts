import {createReducer, on} from '@ngrx/store';
import {Product} from "../../model/Product";
import {retrievedProduct} from "../actions/product.actions";
import {ProductCategory} from "../../model/ProductCategory";
import {retrievedProductCategory} from "../actions/product-category.actions";

export const initialState : ProductCategory[] = [];

const _productCategoryReducer = createReducer(
  initialState,
  on(retrievedProductCategory, (state, {allProductCategory}) => {
    return [...allProductCategory];
  })
)

export function productCategoryReducer(state: any,action: any){
  return _productCategoryReducer(state, action);
}

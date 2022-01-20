import {createReducer, on} from '@ngrx/store';
import {Product} from "../../model/Product";
import {retrievedProduct} from "../actions/product.actions";

export const initialState : Product[] = [];

const _productReducer = createReducer(
  initialState,
  on(retrievedProduct, (state, {allProduct}) => {
    return [...allProduct];
  })
)

export function productReducer(state: any,action: any){
  return _productReducer(state, action);
}

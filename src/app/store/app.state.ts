import {Product} from "../model/Product";
import {ProductCategory} from "../model/ProductCategory";

export interface AppState {
  product: Product[];
  productCategory: ProductCategory[];
}

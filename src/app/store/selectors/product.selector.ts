import {createSelector} from '@ngrx/store';
import {AppState} from "../app.state";

export const productRootSelector = (state:AppState) => state.product;



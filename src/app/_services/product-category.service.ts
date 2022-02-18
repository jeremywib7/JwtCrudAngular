import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {ProductCategory} from "../model/ProductCategory";

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  private apiServerUrl = environment.apiBaseUrl;
  private project = environment.project;

  constructor(private httpClient: HttpClient) {
  }

  addProductCategory(productCategory: ProductCategory) {
    return this.httpClient.post(`${this.apiServerUrl}/${this.project}/category/add`, productCategory)
      .pipe(map((data: any) => data|| []))
  }

  loadProductCategories() {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/category/all`)
      .pipe(map((data: any) => data|| []))
  }

  getTotalProductByCategory(params: HttpParams) {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/count/productByCategory`, {params})
      .pipe(map((data) => data || []))
  }

  loadProductsNameOnlyByCategory(params: HttpParams) {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/findNameOnly/byCategory`,
      {params}).pipe(map((data) => data || []))
  }

}

import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {map, Observable} from "rxjs";
import {Product} from "../model/Product";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiServerUrl = environment.apiBaseUrl;
  private project = environment.project;

  constructor(private httpClient: HttpClient) {
  }

  loadAllProducts(minCalories: number, maxCalories: number,
               minPrice: number, maxPrice: number, pageNumber: number) {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/all?minPrice=` + minPrice +
      `&maxPrice=` + maxPrice + `&minCalories=` + minCalories + `&maxCalories=` + maxCalories)
      .pipe(map((data) => data || []))
  }

  loadProductsByNameAutoComplete(searchValue: string) {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/findByNameAutoComplete?name=` + searchValue)
      .pipe(map((data) => data || []))
  }

  loadProductsByName(searchValue: string) {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/findByName?name=` + searchValue)
      .pipe(map((data) => data || []))
  }

  loadProductsByFilter(categoryId: number, minCalories: number, maxCalories: number,
                       minPrice: number, maxPrice: number, pageNumber: number) {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/findByCategory?categoryId=` + categoryId
      + `&minPrice=` + minPrice + `&maxPrice=` + maxPrice + `&minCalories=` + minCalories + `&maxCalories=` + maxCalories)
      .pipe(map((data) => data || []))
  }

}

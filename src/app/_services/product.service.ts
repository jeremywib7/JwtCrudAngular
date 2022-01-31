import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
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

  loadAllProducts(params: HttpParams) {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/all`, {params})
      .pipe(map((data) => data || []))
  }

  loadProductsByNameAutoComplete(searchValue: string) {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/findByNameAutoComplete?name=` + searchValue)
      .pipe(map((data) => data || []))
  }

  loadProductsSearchByName(searchValue: string) {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/findByName?name=` + searchValue)
      .pipe(map((data) => data || []))
  }

  loadProductDetailById(id: string) {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/findById?id=` + id)
      .pipe(map((data) => data || []))
  }

  loadProductsByFilter(params : HttpParams) {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/findByCategory`, {params})
      .pipe(map((data) => data || []))
  }

}

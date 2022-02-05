import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {map, Observable, of, switchMap} from "rxjs";
import {Product} from "../model/Product";
import {User} from "../model/User";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiServerUrl = environment.apiBaseUrl;
  private project = environment.project;

  constructor(private httpClient: HttpClient) {
  }

  public addProduct(product: Product): Observable<User> {
    return this.httpClient.post<User>(`${this.apiServerUrl}/${this.project}/product/add`, product);
  }

  public deleteProductById(id: string): Observable<Product> {
    return this.httpClient.delete<Product>(`${this.apiServerUrl}/${this.project}/product/delete/${id}`);
  }

  loadAllProductCategory() {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/category/all`)
      .pipe(map((data) => data || []))
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

  loadProductsByFilter(params: HttpParams) {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/findByCategory`, {params})
      .pipe(map((data) => data || []))
  }

}

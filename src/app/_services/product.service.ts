import {Injectable, OnInit} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import {map, Observable} from "rxjs";
import {Product} from "../model/Product";

@Injectable({
  providedIn: 'root'
})
export class ProductService{

  private apiServerUrl = environment.apiBaseUrl;
  private project = environment.project;

  constructor(private httpClient: HttpClient) {
  }

  // public getProducts(): Observable<Product[]> {
  //   return this.httpClient.get<Product[]>(`${this.apiServerUrl}/${this.project}/product/all`);
  // }

  loadProducts(pageNumber: number) {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/all?page=${pageNumber}`)
      .pipe(map((data) => data|| []))
  }

  loadProductsByCategoryId(categoryId: number, pageNumber: number) {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/findByCategory?id=${categoryId}
    &page=${pageNumber}`)
      .pipe(map((data) => data|| []))
  }

}

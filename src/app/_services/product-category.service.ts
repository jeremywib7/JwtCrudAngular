import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {User} from "../model/User";
import {ProductCategory} from "../model/ProductCategory";

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  private apiServerUrl = environment.apiBaseUrl;
  private project = environment.project;

  constructor(private httpClient: HttpClient) {
  }

  loadProductCategories() {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/category/all`)
      .pipe(map((data: any) => data|| []))
  }

}

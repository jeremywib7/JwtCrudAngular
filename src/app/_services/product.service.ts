import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {map, Observable, of, switchMap} from "rxjs";
import {Product} from "../model/Product";
import {ProductCategory} from "../model/ProductCategory";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiServerUrl = environment.apiBaseUrl;
  private project = environment.project;

  constructor(private httpClient: HttpClient) {
  }

  public addOrAndUpdateProduct(product: Product, imageFiles?: File[], editMode?: boolean): Observable<Product> {
    let observable = of({});

    if (imageFiles) {
      imageFiles.forEach((obj, index) => {

        observable = observable.pipe(
          switchMap(() => {

            const formData: FormData = new FormData();
            formData.append('file', obj);
            formData.append('name', product.id + "_" + index);

            return this.httpClient.post(`${this.apiServerUrl}/${this.project}/images/product/upload`, formData, {
              responseType: 'text'
            });
          })
        )
      });

    }

    if (editMode === true) {
      return observable.pipe(
        switchMap(() => {
          return this.httpClient.put<Product>(`${this.apiServerUrl}/${this.project}/product/update`, product);
        })
      );
    } else {
      return observable.pipe(
        switchMap(() => {
          return this.httpClient.post<Product>(`${this.apiServerUrl}/${this.project}/product/add`, product);
        })
      );
    }

  }

  public getUUID() {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/uuid`);
  }

  public deleteProductById(id: string): Observable<Product> {
    return this.httpClient.delete<Product>(`${this.apiServerUrl}/${this.project}/product/delete/${id}`);
  }

  public loadAllProductCategory(): Observable<ProductCategory[]> {
    return this.httpClient.get<ProductCategory[]>(`${this.apiServerUrl}/${this.project}/category/all`);
  }


  loadAllProducts(params: HttpParams) {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/all`, {params})
      .pipe(map((data) => data || []))
  }

  loadProductsByNameAutoComplete(searchValue: string) {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/findByNameAutoComplete?name=` + searchValue)
      .pipe(map((data) => data || []))
  }

  loadProductsNameOnlyByCategory(params: HttpParams) {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/findNameOnly/byCategory`,
      {params}).pipe(map((data) => data || []))
  }

  loadProductsSearchByName(searchValue: string) {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/findByName?name=` + searchValue)
      .pipe(map((data) => data || []))
  }

  loadProductDetailById(params: HttpParams) {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/findById`, {params})
      .pipe(map((data) => data || []))
  }

  loadProductsByFilter(params: HttpParams) {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/findByCategory`, {params})
      .pipe(map((data) => data || []))
  }

}

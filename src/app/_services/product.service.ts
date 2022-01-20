import {Injectable, OnInit} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import {Observable} from "rxjs";
import {Product} from "../model/Product";

@Injectable({
  providedIn: 'root'
})
export class ProductService implements OnInit{

  private apiServerUrl = environment.apiBaseUrl;
  private project = environment.project;

  public products: Observable<Product[]>;

  constructor(private httpClient: HttpClient) {

  }

  ngOnInit() {
    console.log("initiaded");
  }

  public getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.apiServerUrl}/${this.project}/product/all`);
  }

  getlistProducts() {
    this.getProducts().subscribe(
      (data: object[]) => {
        this.products = data['data'];
      },
    );
  }
}

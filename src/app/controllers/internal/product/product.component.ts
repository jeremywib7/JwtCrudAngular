import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../../_services/product.service";
import {User} from "../../../model/User";
import {HttpErrorResponse} from "@angular/common/http";
import {Product} from "../../../model/Product";
import {HeaderExternalComponent} from "../../ui/header.external/header.external.component";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class InternalProductComponent implements OnInit {

  constructor(private productService: ProductService, private headerExternal : HeaderExternalComponent) { }

  public products: Product[];
  productPageNumber: number = 0;

  ngOnInit(): void {
    this.getlistProducts();
  }

  getlistProducts() {
    this.productService.loadProducts(this.productPageNumber).subscribe(
      (data: Product[]) => {
        this.products = data;
        },
    );
  }

}

import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../../_services/product.service";
import {User} from "../../../model/User";
import {HttpErrorResponse} from "@angular/common/http";
import {Product} from "../../../model/Product";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class InternalProductComponent implements OnInit {

  constructor(private productService: ProductService) { }

  public products: Product[];

  ngOnInit(): void {
    this.getlistProducts();
  }

  getlistProducts() {
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
        },
    );
  }

}

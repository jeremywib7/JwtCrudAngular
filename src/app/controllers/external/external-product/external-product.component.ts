import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../../_services/product.service";
import {Product} from "../../../model/Product";

@Component({
  selector: 'app-external-product',
  templateUrl: './external-product.component.html',
  styleUrls: ['./external-product.component.css']
})
export class ExternalProductComponent implements OnInit {

  constructor(private productService: ProductService) { }

  public products: Product[] | undefined;

  ngOnInit(): void {
    this.getlistProducts();
  }

  getlistProducts() {
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data['data'];
      },
    );
  }

}

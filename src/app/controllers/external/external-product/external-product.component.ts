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

  // images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/1800/900`);

  public products: object[]| undefined;

  ngOnInit(): void {
    this.getlistProducts();
  }

  getlistProducts() {
    this.productService.getProducts().subscribe(
      (data: object[]) => {
        this.products = data['data'];
      },
    );
  }

}

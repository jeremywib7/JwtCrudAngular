import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../../_services/product.service";

@Component({
  selector: 'app-header-external',
  templateUrl: './header.external.component.html',
  styleUrls: ['./header.external.component.css']
})
export class HeaderExternalComponent implements OnInit {

  constructor(private productService: ProductService) { }

  public products: object[]| undefined;
  keyword: any = 'name';

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

import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../../_services/product.service";
import {Product} from "../../../model/Product";
import {Store} from "@ngrx/store";
import {retrievedProduct} from "../../../store/actions/product.actions";

@Component({
  selector: 'app-external-product',
  templateUrl: './external-product.component.html',
  styleUrls: ['./external-product.component.css']
})
export class ExternalProductComponent implements OnInit {

  constructor(
    private productService: ProductService,
    private store: Store) {
  }

  public products: object[] | undefined;

  ngOnInit(): void {
    // this.getlistProducts();
  }

  getlistProducts() {
    this.productService.getProducts().subscribe(
      (data: object[]) => {
        // this.products = data['data'];
        this.store.dispatch(retrievedProduct({allProduct: data['data'] as Product[]}));
      },
    );
  }

}

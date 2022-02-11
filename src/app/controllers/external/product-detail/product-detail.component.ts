import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Route, Router} from "@angular/router";
import {Product} from "../../../model/Product";
import {ProductService} from "../../../_services/product.service";
import {environment} from "../../../../environments/environment";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  constructor(
    private _activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
  }

  product: Product;

  apiBaseUrl = environment.apiBaseUrl;
  projectName = environment.project;

  ngOnInit(): void {
    this.detailProduct();
  }

  id: string;

  //skeleton
  contentLoaded = false;

  detailProduct() {
    this._activatedRoute.queryParams.subscribe(params => {

      this.id = params['i'];
      if (this.id === undefined) {
        this.router.navigate(['ext/product']);
      }
    });

    this.getProductDetail();
  }

  async getProductDetail() {
    let params = new HttpParams();
    params = params.append('id', this.id);

    await this.productService.loadProductDetailById(params).subscribe(
      (data: Product[]) => {
        this.product = data['data'];
        this.contentLoaded = true;
      },
    );
  }


}

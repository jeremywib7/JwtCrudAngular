import {Component, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {productById} from "../../../store/selectors/product.selector";
import {Product} from "../../../model/Product";
import {ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Router} from "@angular/router";
import {retrievedProduct} from "../../../store/actions/product.actions";
import {ProductService} from "../../../_services/product.service";
import {allProductCategory} from "../../../store/selectors/product-category.selector";
import {environment} from "../../../../environments/environment";
import {LabelType, Options} from "@angular-slider/ngx-slider";
import {formatCurrency} from '@angular/common';
import { HttpParams } from '@angular/common/http';
import {retrievedProductCategory} from "../../../store/actions/product-category.actions";
import {ProductCategory} from "../../../model/ProductCategory";

@Component({
  selector: 'app-product-by-category',
  templateUrl: './product-by-category.component.html',
  styleUrls: ['./product-by-category.component.scss']
})
export class ExternalProductByCategoryComponent implements OnInit {

  //set as not selected any a.k.a -1
  productSelectedId = -1;

  //skeleton
  contentLoaded = false;

  //from ngrx storage
  allProduct$ = this.store.pipe(select(productById(this.productSelectedId)));
  allProductCategories$ = this.store.pipe(select(allProductCategory()));

  //get id from parameter (1, 2, etc)
  currentCategoryId: number;
  minCalories: number;
  maxCalories: number;
  minPrice: number;
  maxPrice: number;

  productByCategory: Product[] = [];

  //first page
  productsPageNumber: number = 0;

  optionsCalories: Options = {
    floor: 0,
    ceil: 200,
    step: 20,
    showTicks: true,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return `<b style="font-size: 12px">${value} Cals</b>`;
        case LabelType.High:
          return `<b style="font-size: 12px">${value} Cals</b>`;
        default:
          return null;
        // return "Rp. " + value;
      }
    }
  };

  optionsPrice: Options = {
    floor: 0,
    ceil: 100000,
    step: 10000,
    showTicks: true,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return `<b style="font-size: 12px">${formatCurrency(value, "en-US", "Rp. ", "IDR"
            , "1.0-0")}</b>`;
        case LabelType.High:
          return `<b style="font-size: 12px">${formatCurrency(value, "en-US", "Rp. ", "IDR"
            , "1.0-0")}</b>`;
        default:
          return null;
        // return "Rp. " + value;
      }
    }
  };

  first: boolean = true;
  constructor(
    private store: Store<{ product: Product[] }>,
    private productService: ProductService,
    private _activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.listProducts();
    await this.getlistProducts(this.currentCategoryId);

  }


  listProducts() {
    this._activatedRoute.queryParams.subscribe(params => {

      this.currentCategoryId = +params['categoryId'];
      this.currentCategoryId === undefined || Number.isNaN(this.currentCategoryId) ? this.currentCategoryId = -1 : null;

      this.minCalories = +params['minCalories'];
      this.minCalories === undefined || Number.isNaN(this.minCalories) ? this.minCalories = 0 : null;

      this.maxCalories = +params['maxCalories'];
      this.maxCalories === undefined || Number.isNaN(this.maxCalories) ? this.maxCalories = 200 : null;

      this.minPrice = +params['minPrice'];
      this.minPrice === undefined || Number.isNaN(this.minPrice) ? this.minPrice = 0 : null;

      this.maxPrice = +params['maxPrice'];
      this.maxPrice === undefined || Number.isNaN(this.maxPrice) ? this.maxPrice = 100000 : null;
    });

  }

  async getlistProducts(currentCategoryId: number) {
    console.log("initiated");
    if (currentCategoryId === -1) {
      //fetch all products
      this.productService.loadProducts(this.minCalories, this.maxCalories,
        this.minPrice, this.maxPrice, this.productsPageNumber).subscribe(
        (data: Product[]) => {
          this.productByCategory = data['data']['content'];
          this.contentLoaded = true;

        }
      );
    } else {
      //check if search is empty
      //if not then search


      //fetch product based on category
      await this.productService.loadProductsByFilter(currentCategoryId, this.minCalories, this.maxCalories,
        this.minPrice, this.maxPrice, this.productsPageNumber).subscribe(
        (data: Product[]) => {
          this.productByCategory = data['data']['content'];
          this.contentLoaded = true;
        },
      );
    }



    // update url param
    this.router.navigate([], {

      relativeTo: this._activatedRoute,
      queryParams: {
        'categoryId': currentCategoryId,
        'minPrice': this.minPrice === undefined || this.minPrice === 0 ? null : this.minPrice,
        'maxPrice': this.maxPrice === undefined || this.maxPrice === 0 || this.maxPrice === 100000 ? null :
          this.maxPrice,
        'minCalories': this.minCalories === undefined || this.minCalories === 0 ? null : this.minCalories,
        'maxCalories': this.maxCalories === undefined || this.maxCalories === 0 || this.maxCalories === 200 ? null :
          this.maxCalories,
      },
      queryParamsHandling: 'merge',
    })
  }

}

import {Component, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {productById} from "../../../store/selectors/product.selector";
import {Product} from "../../../model/Product";
import {ActivatedRoute, Router} from "@angular/router";
import {retrievedProduct} from "../../../store/actions/product.actions";
import {ProductService} from "../../../_services/product.service";
import {allProductCategory} from "../../../store/selectors/product-category.selector";
import {environment} from "../../../../environments/environment";
import {LabelType, Options} from "@angular-slider/ngx-slider";
import {formatCurrency} from '@angular/common';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-product-by-category',
  templateUrl: './product-by-category.component.html',
  styleUrls: ['./product-by-category.component.scss']
})
export class ExternalProductByCategoryComponent implements OnInit {

  //set as not selected any a.k.a -1
  productSelectedId = -1;

  //from ngrx storage
  allProduct$ = this.store.pipe(select(productById(this.productSelectedId)));
  allProductCategories$ = this.store.pipe(select(allProductCategory()));

  //get id from parameter (1, 2, etc)
  currentCategoryId: number;
  minCalories: number | undefined;
  maxCalories: number | undefined;
  minPrice: number | undefined;
  maxPrice: number | undefined;

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

  constructor(
    private store: Store<{ product: Product[] }>,
    private productService: ProductService,
    private _activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.listProducts();
  }

  firstInit: boolean = false;

  listProducts() {
    // this.currentCategoryId = +this._activatedRoute.snapshot.paramMap.get('id');
    this._activatedRoute.queryParams.subscribe(params => {

      //set only on first init because if it is always fetched on slider change the slider will be bugged
      if (this.firstInit === false) {
        this.firstInit = true;

        this.currentCategoryId = params['categoryId'];
        this.currentCategoryId === undefined ? this.currentCategoryId = 0 : this.minCalories;

        this.minCalories = params['minCalories'];
        this.minCalories === undefined ? this.minCalories = 0 : null;

        this.maxCalories = params['maxCalories'];
        this.maxCalories === undefined ? this.maxCalories = 200 : null;

        this.minPrice = params['minPrice'];
        this.minPrice === undefined ? this.minPrice = 0 : this.minPrice;

        this.maxPrice = params['maxPrice'];
        this.maxPrice === undefined ? this.maxPrice = 100000 : this.maxPrice;
      }
    });

    this.getlistProducts(this.currentCategoryId, this.minCalories, this.maxCalories, this.minPrice, this.maxPrice,
      this.productsPageNumber);
  }

  getlistProducts(currentCategoryId: number, minCalories: number, maxCalories: number, minPrice: number, maxPrice: number
    , page: number) {
    //fetch product
    this.productService.loadProductsByFilter(currentCategoryId, minCalories, maxCalories,
      minPrice, maxPrice, page).subscribe(
      (data: Product[]) => {
        this.productByCategory = data['data']['content'];
      },
    );

    // update url
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

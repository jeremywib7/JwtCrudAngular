import {Component, OnInit, ViewChild} from '@angular/core';
import {ProductService} from "../../../_services/product.service";
import {AppComponent} from "../../../app.component";
import {select, Store} from "@ngrx/store";
import {Product} from "../../../model/Product";
import {productById} from "../../../store/selectors/product.selector";
import {ProductCategory} from "../../../model/ProductCategory";
import {allProductCategory} from "../../../store/selectors/product-category.selector";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-header-external',
  templateUrl: './header.external.component.html',
  styleUrls: ['./header.external.component.css']
})
export class HeaderExternalComponent implements OnInit {

  // @ViewChild('appDashboard', { static: false }) productByCat: ExternalProductByCategoryComponent;

  //for autocomplete
  data = [];
  searchValue: any;

  //for store
  productSelectedId = "all";
  allProduct$ = this.store.pipe(select(productById(this.productSelectedId)));
  allProductCategories$ = this.store.pipe(select(allProductCategory()));

  //check url params
  currentCategoryId: number;
  minCalories: number;
  maxCalories: number;
  minPrice: number;
  maxPrice: number;


  constructor(
    // private productService: ProductService,
    private store: Store<{ product: Product[], productCategory: ProductCategory[] }>,
    private _activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
  ) {
  }

  ngOnInit()
    :
    void {
  }

  route() {
    if (this.searchValue != undefined && this.searchValue.replace(/\s/g, '').length) {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
        this.router.navigate(['/ext/product'], {
          queryParams: {
            'nameSearch': this.searchValue,
          },
        }));
    }

  }

  async onChange(item) {
    this.searchValue = item;
    await this.productService.loadProductsByNameAutoComplete(item).subscribe(
      (data: Product[]) => {
        this.data = data['data'];
      },
    );
  }

  onSelect(item) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate(['/ext/product'], {
        queryParams: {
          'nameSearch': item.name,
        },
      }));
  }

  selectCategory(currentCategoryId: number) {
    this._activatedRoute.queryParams.subscribe(params => {

      this.currentCategoryId = +params['categoryId'];
      this.currentCategoryId === undefined || Number.isNaN(this.currentCategoryId) ? this.currentCategoryId = 0 : null;

      this.minCalories = +params['minCalories'];
      this.minCalories === undefined || Number.isNaN(this.minCalories) ? this.minCalories = 0 : null;

      this.maxCalories = +params['maxCalories'];
      this.maxCalories === undefined || Number.isNaN(this.maxCalories) ? this.maxCalories = 200 : null;

      this.minPrice = +params['minPrice'];
      this.minPrice === undefined || Number.isNaN(this.minPrice) ? this.minPrice = 0 : null;

      this.maxPrice = +params['maxPrice'];
      this.maxPrice === undefined || Number.isNaN(this.maxPrice) ? this.maxPrice = 100000 : null;
    });

    this.router.navigate(['/ext/category/filter/'], {
      queryParams: {
        'categoryId': currentCategoryId,
        'minPrice': this.minPrice === undefined || this.minPrice === 0 ? null : this.minPrice,
        'maxPrice': this.maxPrice === undefined || this.maxPrice === 0 || this.maxPrice === 100000 ? null :
          this.maxPrice,
        'minCalories': this.minCalories === undefined || this.minCalories === 0 ? null : this.minCalories,
        'maxCalories': this.maxCalories === undefined || this.maxCalories === 0 || this.maxCalories === 200 ? null :
          this.maxCalories,
      },
    })
  }

}

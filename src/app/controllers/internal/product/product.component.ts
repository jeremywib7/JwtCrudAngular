import {Component, OnInit, ViewChild} from '@angular/core';
import {ProductService} from "../../../_services/product.service";
import {Pagination, Product} from "../../../model/Product";
import {MatTableDataSource} from '@angular/material/table';
import {HttpParams} from "@angular/common/http";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class InternalProductComponent implements OnInit {

  apiBaseUrl = environment.apiBaseUrl;
  projectName = environment.project;

  constructor(
    private productService: ProductService,
    private router: Router,
    private _activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.onInit(this.productsPageNumber, this.productsSizeNumber);
  }

  @ViewChild(MatSort) matSort!: MatSort;

  dataSource!: MatTableDataSource<Product[]>;
  product: Product[];

  currentCategoryId: string = "all";
  minCalories: number = 0;
  maxCalories: number = 100000;
  minPrice: number = 0;
  maxPrice: number = 10000000;

  //angular table
  displayedColumns: string[] = ['image','name', 'description', 'price', 'edit', 'delete'];
  //first page
  productsPageNumber: number = 0;
  productsSizeNumber: number = 10;
  pagination: Pagination;
  pageEvent: PageEvent;

  params = new HttpParams();


  async onInit(page: number, size: number) {

    //reset and set page and size
    await this.getPageAndSize(page, size);
    await this.loadAllProducts();
  }

  async onPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;

    //get current page and size
    await this.getPageAndSize(page, size);
    await this.loadAllProducts();
  }

  async loadAllProducts() {
    await this.productService.loadAllProducts(this.params).subscribe(
      (data: object) => {
        this.dataSource = new MatTableDataSource(data['data']['content']);
        this.pagination = data['data'];
        this.dataSource.sort = this.matSort;

        //  for autocomplete
        this.product = data['data']['content'];
      },
    );
  }

  getPageAndSize(page: number, size: number) {
    this.params = new HttpParams();

    this.params = this.params.append('page', JSON.stringify(page));
    this.params = this.params.append('size', JSON.stringify(size));

  }

  onEditButtonClicked(id: string) {
    console.log(id);
  }

  async getlistProductsNameSearch(item) {
    console.log(item);
    await this.productService.loadProductsSearchByName(item.name).subscribe(
      (data: Product[]) => {
        this.dataSource = new MatTableDataSource(data['data']['content']);
        this.pagination = data['data'];
        this.dataSource.sort = this.matSort;
        // this.contentLoaded = true;
      },
    );

    // update url param
    this.router.navigate([], {

      relativeTo: this._activatedRoute,
      queryParams: {
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

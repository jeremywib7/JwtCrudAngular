import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {ProductService} from "../../../../_services/product.service";
import {ActivatedRoute, Router, RouterLinkActive, Routes} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {debounceTime, finalize, switchMap, tap} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {Pagination, Product} from "../../../../model/Product";
import {FormControl} from "@angular/forms";
import {PageEvent} from "@angular/material/paginator";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css']
})
export class ProductTableComponent implements OnInit {

  apiBaseUrl = environment.apiBaseUrl;
  projectName = environment.project;

  constructor(
    private productService: ProductService,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private ngbModal: NgbModal,
    private toastr: ToastrService,
  ) {

    this.searchProductCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.product = [];
          this.isLoading = true;
        }),
        switchMap((value) => {

          return this.productService.loadProductsSearchByName(value)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              })
            );

        })
      )
      .subscribe(data => {
        this.dataSource = new MatTableDataSource(data['data']['content']);
        this.pagination = data['data'];
        this.dataSource.sort = this.matSort;

        //  for autocomplete
        this.product = data['data']['content'];
      });

  }

  ngOnInit(): void {
    this.onInit(this.productsPageNumber, this.productsSizeNumber);
  }

  //for sorting table
  @ViewChild(MatSort) matSort!: MatSort;

  dataSource!: MatTableDataSource<Product[]>; // for display data in table with sorting
  product: Product[]; //for display autocomplete

  searchProductCtrl = new FormControl(); // for search
  errorMsg: string;
  isLoading = false;

  //for passing query params
  currentCategoryId: string = "all";
  minCalories: number = 0;
  maxCalories: number = 100000;
  minPrice: number = 0;
  maxPrice: number = 10000000;

  //angular table
  displayedColumns: string[] = ['image', 'name', 'description', 'price', 'edit', 'delete'];
  //first page
  productsPageNumber: number = 0;
  productsSizeNumber: number = 10;
  pagination: Pagination;
  pageEvent: PageEvent;

  params = new HttpParams();


  async onInit(page: number, size: number) {

    //reset and set page and size
    await this.getPageAndSize(page, size);
    await this.loadProducts();
  }

  clearSearch() {
    this.searchProductCtrl.setValue('');
  }

  async onPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;

    //get current page and size
    await this.getPageAndSize(page, size);
    await this.loadProducts();
  }

  async loadProducts() {
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

  onDeleteButtonClicked(content) {
    this.ngbModal.open(content);
  }

  onDeleteButtonConfirmed(id: string) {
    this.productService.deleteProductById(id).subscribe(res => {
      this.toastr.success('Delete Product Success', 'Success');
      this.ngbModal.dismissAll();
      this.loadProducts();
    });
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

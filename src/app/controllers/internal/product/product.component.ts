import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../../_services/product.service";
import {Pagination, Product} from "../../../model/Product";
import {MatTableDataSource} from '@angular/material/table';
import {MatSort, Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {HttpParams} from "@angular/common/http";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class InternalProductComponent implements OnInit {

  constructor(private productService: ProductService, private _liveAnnouncer: LiveAnnouncer) {
  }

  ngOnInit(): void {
    this.getAllProducts(this.productsPageNumber, this.productsSizeNumber);
  }

  product: Product[] = [];

  currentCategoryId: string = "all";
  minCalories: number = 0;
  maxCalories: number = 100000;
  minPrice: number = 0;
  maxPrice: number = 10000000;

  //angular table
  displayedColumns: string[] = ['name', 'description', 'price'];
  //first page
  productsPageNumber: number = 0;
  productsSizeNumber: number = 10;
  pagination: Pagination;
  pageEvent: PageEvent;

  params = new HttpParams();

  async getAllProducts(page: number, size: number) {

    //reset and set page and size
    await this.getPageAndSize(page, size);

    await this.productService.loadAllProducts(this.params).subscribe(
      (data: object) => {
        this.product = data['data']['content'];
        this.pagination = data['data'];
      },
    );
  }

  async onPaginateChange(event: PageEvent) {
    console.log("pagination changed");

    let page = event.pageIndex;
    let size = event.pageSize;

    //reset and set page and size
    await this.getPageAndSize(page, size);

    await this.productService.loadAllProducts(this.params).subscribe(
      (data: object) => {
        this.product = data['data']['content'];
        this.pagination = data['data'];
      },
    );
  }

  getPageAndSize(page: number, size:number) {
    this.params = new HttpParams();

    this.params = this.params.append('page', JSON.stringify(page));
    this.params = this.params.append('size', JSON.stringify(size));

  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }


}

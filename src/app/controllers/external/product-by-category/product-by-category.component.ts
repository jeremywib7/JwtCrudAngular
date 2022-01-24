import {Component, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {productById} from "../../../store/selectors/product.selector";
import {Product} from "../../../model/Product";
import {ActivatedRoute, Router} from "@angular/router";
import {retrievedProduct} from "../../../store/actions/product.actions";
import {ProductService} from "../../../_services/product.service";
import {allProductCategory} from "../../../store/selectors/product-category.selector";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-product-by-category',
    templateUrl: './product-by-category.component.html',
    styleUrls: ['./product-by-category.component.css']
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

    listProducts() {
        this.currentCategoryId = +this._activatedRoute.snapshot.paramMap.get('id');
        this._activatedRoute.queryParams.subscribe(params => {
            this.minCalories = params['minCalories'];
            this.minCalories === undefined ? this.minCalories = 0 : this.minCalories;

            this.maxCalories = params['maxCalories'];
            this.maxCalories === undefined ? this.maxCalories = 1000000 : this.maxCalories;

            this.minPrice = params['minPrice'];
            this.minPrice === undefined ? this.minPrice = 0 : this.minPrice;

            this.maxPrice = params['maxPrice'];
            this.maxPrice === undefined ? this.maxPrice = 1000000 : this.maxPrice;
        });

        this.getlistProducts(this.currentCategoryId);
    }

    getlistProducts(currentCategoryId: number) {
        //fetch product
        this.productService.loadProductsByFilter(currentCategoryId, this.minCalories, this.maxCalories,
            this.minPrice, this.maxPrice, this.productsPageNumber).subscribe(
            (data: Product[]) => {
                this.productByCategory = data['data']['content'];
            },
        );

        //update url
        this.router.navigate([`/ext/category/${currentCategoryId}`], {
            queryParams: {
                'minPrice': this.minPrice === undefined || this.minPrice === 0 ? null : this.minPrice,
                'maxPrice': this.maxPrice === undefined || this.maxPrice === 0 ? null : this.maxPrice,
                'minCalories': this.minCalories === undefined || this.minCalories === 0 ? null : this.minCalories,
                'maxCalories': this.maxCalories === undefined || this.maxCalories === 0 ? null : this.maxCalories,
            },
            queryParamsHandling: 'merge'
        })
    }

}

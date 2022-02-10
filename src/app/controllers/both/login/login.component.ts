import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {UserService} from "../../../_services/user.service";
import {UserAuthService} from "../../../_services/user-auth.service";
import {Router} from "@angular/router";
import {Product} from "../../../model/Product";
import {retrievedProductCategory} from "../../../store/actions/product-category.actions";
import {ProductCategory} from "../../../model/ProductCategory";
import {ProductService} from "../../../_services/product.service";
import {ProductCategoryService} from "../../../_services/product-category.service";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  productPageNumber: number = 0;

  constructor(
    private userService: UserService,
    private userAuthService: UserAuthService,
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    private store: Store<{ product: Product[] }>,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  getListProductCategories() {
    this.productCategoryService.loadProductCategories().subscribe(
      (data) => {
        this.store.dispatch(retrievedProductCategory({allProductCategory: data['data'] as ProductCategory[]}));
      },
    );
  }

  public login(loginForm: NgForm) {
    this.userService.login(loginForm.value).subscribe(
      (response: any) => {

        // set in cookies
        this.userAuthService.setRoles(response.user.role);
        this.userAuthService.setToken(response.jwtToken);

        this.getListProductCategories();

        const userRole = response.user.role.roleName;
        // const userRole = response.user.role[0].roleName;

        if (userRole === "Admin") {
          this.router.navigate(['int/admin']);
        } else if (userRole === "User") {
          this.router.navigate(['int/user']);
        } else if (userRole === "Customer") {
          this.router.navigate(['/']);
        }

      },
      (error) => {
        alert("Wrong credentials");
        console.log(error);
      }
    );
  }

}

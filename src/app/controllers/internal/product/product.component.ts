import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ProductService} from "../../../_services/product.service";
import {Pagination, Product} from "../../../model/Product";
import {MatTableDataSource} from '@angular/material/table';
import {HttpParams} from "@angular/common/http";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute, Router, RouterLinkActive, Routes} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {MatDialog} from "@angular/material/dialog";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {FormControl} from '@angular/forms';
import {debounceTime, finalize, switchMap, tap} from 'rxjs';
import {RxFormBuilder} from "@rxweb/reactive-form-validators";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class InternalProductComponent implements AfterViewInit, OnInit {
  isViewInitialized = false;

  navLinks = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.navLinks = (
      this.route.routeConfig && this.route.routeConfig.children ?
        this.buildNavItems(this.route.routeConfig.children) :
        []
    );
  }

  ngAfterViewInit() {
    this.isViewInitialized = true;
    this.changeDetector.detectChanges();
  }

  buildNavItems(routes: Routes) {
    return (routes)
      .filter(route => route.data)
      .map(({ path = '', data }) => ({
        path: path,
        label: data['label'],
        icon: data['icon']
      }));
  }

  isLinkActive(rla: RouterLinkActive): boolean {
    const routerLink = rla.linksWithHrefs.first;

    return this.router.isActive(routerLink?.urlTree, false);
  }
}

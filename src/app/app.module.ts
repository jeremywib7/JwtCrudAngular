import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './controllers/home/home.component';
import {AdminComponent} from './controllers/admin/admin.component';
import {LoginComponent} from './controllers/login/login.component';
import {ForbiddenComponent} from './controllers/forbidden/forbidden.component';
import {HeaderComponent} from './controllers/header/header.component';
import {UserComponent} from './controllers/user/user.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import {AuthGuard} from "./_auth/auth.guard";
import {AuthInterceptor} from "./_auth/auth.interceptor";
import {UserService} from "./_services/user.service";
import { MemberComponent } from './controllers/member/member.component';
import {MemberService} from "./_services/member.service";
import {DatePipe} from "@angular/common";
import { SidenavComponent } from './controllers/sidenav/sidenav.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    LoginComponent,
    ForbiddenComponent,
    HeaderComponent,
    UserComponent,
    MemberComponent,
    SidenavComponent
  ],
  imports: [
    // * MATERIAL IMPORTS
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
  ],
  providers: [
    AuthGuard, {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    DatePipe,
    UserService,
    MemberService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

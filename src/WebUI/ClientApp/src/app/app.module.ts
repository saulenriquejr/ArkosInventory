import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';

import { CurrencyPipe } from '@angular/common';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { PlacesAdminComponent } from './places-admin/places-admin.component';
import { TodoComponent } from './todo/todo.component';
import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProductsAdminComponent } from './products-admin/products-admin.component';
import { ProvidersAdminComponent } from './providers-admin/providers-admin.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { InventoriesComponent } from './inventories/inventories.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    FetchDataComponent,
    TodoComponent,
    PlacesAdminComponent,
    ProductsAdminComponent,
    ProvidersAdminComponent,
    InvoicesComponent,
    InventoriesComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BsDatepickerModule.forRoot(),
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    NgSelectModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    ApiAuthorizationModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'todo', component: TodoComponent, canActivate: [AuthorizeGuard] },
      { path: 'places', component: PlacesAdminComponent, canActivate: [AuthorizeGuard] },
      { path: 'products', component: ProductsAdminComponent, canActivate: [AuthorizeGuard] },
      { path: 'providers', component: ProvidersAdminComponent, canActivate: [AuthorizeGuard] },
      { path: 'invoices', component: InvoicesComponent, canActivate: [AuthorizeGuard] },
      { path: 'inventories', component: InventoriesComponent, canActivate: [AuthorizeGuard] },
    ]),
    BrowserAnimationsModule,
    ModalModule.forRoot()
  ],
  providers: [CurrencyPipe,
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

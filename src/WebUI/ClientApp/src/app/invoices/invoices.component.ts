import { Component, OnInit, TemplateRef } from '@angular/core';
import { faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PlacesClient, PlaceDto, InvoicesClient, CreateInvoiceDetailDto, ProductsClient, ProductDto, CreateInvoiceCommand } from '../arkos-api';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {

  debug = false;
  //m: InvoicesVm;
  newInvoiceEditor: any = {};
  newInvoiceDetailEditor: any = {};
  newInvoiceDetailModalRef: BsModalRef;
  place: PlaceDto;
  productList: ProductDto[];
  placeList: PlaceDto[];
  invoiceDetailList: CreateInvoiceDetailDto[] = [];
  faPlus = faPlus;
  faEllipsisH = faEllipsisH;

  constructor(
    private modalService: BsModalService,
    private invoicesClient: InvoicesClient,
    private placesClient: PlacesClient,
    private productsClient: ProductsClient
  ) {
    this.placesClient.get().subscribe(
      result => { this.placeList = result.places });
  }

  ngOnInit(): void {

  }

  newInvoiceDetailCancelled(): void {
    this.newInvoiceDetailModalRef.hide();
    this.newInvoiceDetailEditor = {};
    this.newInvoiceEditor = {};
  }

  newInvoiceReset(): void {

  }

  showNewInvoiceModal(template: TemplateRef<any>): void {
    if (this.newInvoiceEditor.place != null && this.newInvoiceEditor.dateInvoice) {
      this.newInvoiceDetailModalRef = this.modalService.show(template);
      this.getProducts();
    }
  }

  getProducts(): void {
    this.productsClient.get().subscribe(result => { this.productList = result.products });
  }

  addInvoiceDetail() {
    if (this.newInvoiceDetailEditor.product.id != null && this.newInvoiceDetailEditor.amount != null) {
      let invoiceDetail = CreateInvoiceDetailDto.fromJS({
        productId: this.newInvoiceDetailEditor.product.id,
        amount: this.newInvoiceDetailEditor.amount
      });
      this.invoiceDetailList.push(invoiceDetail);
      this.newInvoiceDetailEditor = {};
    }
  }

  addInvoice(): void {
    if (this.invoiceDetailList.length > 0) {
      this.invoicesClient.create(<CreateInvoiceCommand>{
        dateInvoice: this.newInvoiceEditor.dateInvoice,
        placeId: this.newInvoiceEditor.place.id,
        invoiceDetails: this.invoiceDetailList,
      }).subscribe(
        result => {
          this.newInvoiceDetailCancelled();
        },
        error => {
          let errors = JSON.parse(error.response);

          if (errors && errors.Title) {
            this.newInvoiceEditor.error = errors.Title[0];
          }
        }
      );
    }
  }
}

import { Component, OnInit, TemplateRef } from '@angular/core';
import { faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PlacesClient, PlaceDto, InvoicesClient, InvoiceDetailDto, ProductsClient, ProductDto, CreateInvoiceCommand, ProvidersClient, ProviderDto, InvoicesVm, InvoiceDto } from '../arkos-api';
import { getLocaleDateTimeFormat } from '@angular/common';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {

  debug = false;
  vm: InvoicesVm;
  newInvoiceEditor: any = {};
  newInvoiceDetailEditor: any = {};
  invoiceOptionsEditor: any = {};
  newInvoiceModalRef: BsModalRef;
  invoiceOptionsModalRef: BsModalRef;
  place: PlaceDto;
  productList: ProductDto[];
  placeList: PlaceDto[];
  providerList: ProviderDto[];
  selectedInvoice: InvoiceDto;
  invoiceList: any;
  clickedRow: number;
  invoiceDetailList: InvoiceDetailDto[] = [];
  faPlus = faPlus;
  faEllipsisH = faEllipsisH;

  constructor(
    private modalService: BsModalService,
    private invoicesClient: InvoicesClient,
    private placesClient: PlacesClient,
    private productsClient: ProductsClient,
    private providerClient: ProvidersClient
  ) {
    this.invoicesClient.get().subscribe(result => {
      this.vm = result;
      if (this.vm.invoices.length) {
        this.selectedInvoice = this.vm.invoices[0];
      }
    });

    this.placesClient.get().subscribe(
      result => { this.placeList = result.places });

    this.providerClient.get().subscribe(
      result => { this.providerList = result.providers });
  }

  ngOnInit(): void {

  }

  newInvoiceCancelled(): void {
    this.newInvoiceModalRef.hide();
    this.newInvoiceEditor = {};
  }

  newInvoiceReset(): void {

  }

  showNewInvoiceModal(template: TemplateRef<any>): void {
    //if (this.newInvoiceEditor.place != null && this.newInvoiceEditor.dateInvoice) {
    //  this.newInvoiceDetailModalRef = this.modalService.show(template);
    //  this.getProducts();
    //}
    this.newInvoiceEditor.dateInvoice = new Date();
    this.newInvoiceModalRef = this.modalService.show(template);
  }

  showInvoiceOptionsModal(template: TemplateRef<any>) {
    this.invoiceOptionsEditor = {
      id: this.selectedInvoice.id,
      dateInvoice: this.selectedInvoice.dateInvoice,
      place: this.selectedInvoice.place,
      provider: this.selectedInvoice.provider,
    };

    this.invoiceOptionsModalRef = this.modalService.show(template);
  }

  getProducts(): void {
    this.productsClient.get().subscribe(result => { this.productList = result.products });
  }

  addInvoiceDetail() {
    if (this.newInvoiceDetailEditor.product.id != null && this.newInvoiceDetailEditor.amount != null) {
      let invoiceDetail = InvoiceDetailDto.fromJS({
        productId: this.newInvoiceDetailEditor.product.id,
        amount: this.newInvoiceDetailEditor.amount
      });
      this.invoiceDetailList.push(invoiceDetail);
      this.newInvoiceDetailEditor = {};
    }
  }

  addInvoice(): void {
    let invoice = InvoiceDto.fromJS({
      dateInvoice: this.newInvoiceEditor.dateInvoice,
      place: this.newInvoiceEditor.place,
      provider: this.newInvoiceEditor.provider
    });
    this.invoicesClient.create(<CreateInvoiceCommand>{
      dateInvoice: this.newInvoiceEditor.dateInvoice,
      placeId: this.newInvoiceEditor.place.id,
      providerId: this.newInvoiceEditor.provider.id
    }).subscribe(
      result => {
        this.vm.invoices.push(invoice);
        this.selectedInvoice = invoice;
        this.newInvoiceModalRef.hide();
        this.newInvoiceEditor = {};
      },
      error => {
        let errors = JSON.parse(error.response);
        if (errors && errors.Title)
          this.newInvoiceEditor.error = errors.Title[0];
      }
    );
  }
}

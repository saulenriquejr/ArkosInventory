import { Component, OnInit, TemplateRef } from '@angular/core';
import { faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  PlacesClient, PlaceDto, InvoicesClient, InvoiceDetailDto, ProductsClient, ProductDto, CreateInvoiceCommand,
  ProvidersClient, ProviderDto, InvoicesVm, InvoiceDto, UpdateInvoiceCommand, InvoiceDetailsClient, CreateInvoiceDetailCommand
} from '../arkos-api';

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
  newInvoiceDetailModalRef: BsModalRef;
  deleteInvoiceModalRef: BsModalRef;
  invoiceOptionsModalRef: BsModalRef;
  place: PlaceDto;
  productList: ProductDto[];
  placeList: PlaceDto[];
  providerList: ProviderDto[];
  selectedInvoice: InvoiceDto;
  selectedDetail: InvoiceDetailDto;
  invoiceList: any;
  clickedRow: number;
  invoiceDetailList: InvoiceDetailDto[] = [];
  faPlus = faPlus;
  faEllipsisH = faEllipsisH;

  constructor(
    private modalService: BsModalService,
    private invoicesClient: InvoicesClient,
    private invoiceDetailsClient: InvoiceDetailsClient,
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

  showDetailOptionsModal(template: TemplateRef<any>): void {

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
      placeId: this.selectedInvoice.place.id,
      providerId: this.selectedInvoice.provider.id
    };

    this.invoiceOptionsModalRef = this.modalService.show(template);
  }

  confirmDeleteInvoice(template: TemplateRef<any>) {
    this.invoiceOptionsModalRef.hide();
    this.deleteInvoiceModalRef = this.modalService.show(template);
  }

  deleteInvoiceConfirmed(): void {
    this.invoicesClient.delete(this.selectedInvoice.id).subscribe(
      () => {
        this.deleteInvoiceModalRef.hide();
        this.vm.invoices = this.vm.invoices.filter(t => t.id != this.selectedInvoice.id)
        this.selectedInvoice = this.vm.invoices.length ? this.vm.invoices[0] : null;
      },
      error => console.error(error)
    );
  }

  updateInvoiceOptions() {
    this.invoicesClient.update(this.selectedInvoice.id, <UpdateInvoiceCommand>{
      id: this.invoiceOptionsEditor.id,
      dateInvoice: this.invoiceOptionsEditor.dateInvoice,
      placeId: this.invoiceOptionsEditor.placeId,
      providerId: this.invoiceOptionsEditor.providerId,
    }).subscribe(
      () => {
        this.selectedInvoice.dateInvoice = this.invoiceOptionsEditor.dateInvoice;
        this.selectedInvoice.place = this.placeList.find(pl => pl.id == this.invoiceOptionsEditor.placeId);
        this.selectedInvoice.provider = this.providerList.find(pr => pr.id == this.invoiceOptionsEditor.providerId);
        this.invoiceOptionsModalRef.hide();
        this.invoiceOptionsEditor = {};
        this.vm.invoices;
      },
      error => console.error(error)
    );
  }

  getProducts(): void {
    this.productsClient.get().subscribe(result => { this.productList = result.products });
  }

  showNewInvoiceDetailModal(template: TemplateRef<any>) {
    this.getProducts();
    this.newInvoiceDetailModalRef = this.modalService.show(template);
  }

  addDetail() {
    let detail = InvoiceDetailDto.fromJS({
      id: 0,
      invoiceId: this.selectedInvoice.id,
      amount: this.newInvoiceDetailEditor.amount,
      product: this.newInvoiceDetailEditor.product
    });
    this.invoiceDetailsClient.create(<CreateInvoiceDetailCommand>{
      invoiceId: this.selectedInvoice.id,
      productId: detail.product.id,
      amount: detail.amount
    }).subscribe(
      result => {
        detail.id = result;
        this.selectedInvoice.invoiceDetails.push(detail);
        this.selectedDetail = detail;
        this.newInvoiceDetailModalRef.hide();
        this.newInvoiceDetailEditor = {};
      },
      error => console.error(error)
    );
  }

  editItem(detail: InvoiceDetailDto, inputId: string): void {
    this.selectedDetail = detail;
    setTimeout(() => document.getElementById(inputId).focus(), 100);
  }

  addInvoice(): void {
    let invoice = InvoiceDto.fromJS({
      id: 0,
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
        invoice.id = result;
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

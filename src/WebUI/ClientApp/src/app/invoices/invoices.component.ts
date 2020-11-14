import { Component, OnInit, TemplateRef } from '@angular/core';
import { faPlus, faEllipsisH, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  PlacesClient, PlaceDto, InvoicesClient, InvoiceDetailDto, ProductsClient, ProductPricesClient, ProductDto, ProductPriceDto, CreateInvoiceCommand,
  ProvidersClient, ProviderDto, InvoicesVm, InvoiceDto,
  UpdateInvoiceCommand, InvoiceDetailsClient, CreateInvoiceDetailCommand, InvoiceDetail, UpdateInvoiceDetailCommand, CreateProductPriceCommand, ProductPrice
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
  invoiceDetailOptionsEditor: any = {};
  newInvoiceModalRef: BsModalRef;
  newInvoiceDetailModalRef: BsModalRef;
  invoiceOptionsModalRef: BsModalRef;
  deleteInvoiceModalRef: BsModalRef;
  invoiceDetailOptionsModalRef: BsModalRef;
  deleteInvoiceDetailModalRef: BsModalRef;
  place: PlaceDto;
  productList: ProductDto[];
  productPriceList: ProductPriceDto[];
  placeList: PlaceDto[];
  providerList: ProviderDto[];
  selectedInvoice: InvoiceDto;
  selectedDetail: InvoiceDetailDto;
  invoiceList: any;
  invoiceDetailList: InvoiceDetailDto[] = [];
  faPlus = faPlus;
  faEllipsisH = faEllipsisH;
  faPencilAlt = faPencilAlt;

  constructor(
    private modalService: BsModalService,
    private invoicesClient: InvoicesClient,
    private invoiceDetailsClient: InvoiceDetailsClient,
    private placesClient: PlacesClient,
    private productPricesClient: ProductPricesClient,
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

    this.productsClient.get().subscribe(
      result => { this.productList = result.products });

    this.productPricesClient.get().subscribe(
      result => { this.productPriceList = result.productPrices });
  }

  ngOnInit(): void {
  }

  addInvoice(): void {
    this.productPriceList;
    let invoice = InvoiceDto.fromJS({
      id: 0,
      dateInvoice: this.newInvoiceEditor.dateInvoice,
      place: this.newInvoiceEditor.place,
      provider: this.newInvoiceEditor.provider,
      invoiceDetails: []
    });
    this.invoicesClient.create(<CreateInvoiceCommand>{
      dateInvoice: this.newInvoiceEditor.dateInvoice,
      placeId: this.newInvoiceEditor.place.id,
      providerId: this.newInvoiceEditor.provider.id,
      invoiceDetails: []
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

  addInvoiceDetail() {
    let detail = InvoiceDetailDto.fromJS({
      id: 0,
      invoiceId: this.selectedInvoice.id,
      amount: this.newInvoiceDetailEditor.amount,
      product: this.newInvoiceDetailEditor.product,
      productPrice: this.newInvoiceDetailEditor.productPrice
    });

    this.invoiceDetailsClient.create(<CreateInvoiceDetailCommand>{
      invoiceId: detail.invoiceId,
      productId: detail.product.id,
      amount: detail.amount,
      productPrice: detail.productPrice

    }).subscribe(
      result => {
        detail.id = result;
        this.selectedInvoice.invoiceDetails.push(detail);
        this.selectedDetail = detail;

        if (this.selectedDetail.productPrice != this.productPriceList.find(pp => pp.productId == this.selectedDetail.product.id).price) {
          this.productPricesClient.create(<CreateProductPriceCommand>{
            placeId: this.selectedInvoice.place.id,
            productId: detail.product.id,
            price: detail.productPrice
          }).subscribe(result => { this.getLatestProductPrice(); }, error => console.error(error));
        }

        this.newInvoiceDetailModalRef.hide();
        this.newInvoiceDetailEditor = {};
      },
      error => console.error(error)
    );
  }

  confirmDeleteInvoice(template: TemplateRef<any>) {
    this.invoiceOptionsModalRef.hide();
    this.deleteInvoiceModalRef = this.modalService.show(template);
  }

  confirmDeleteInvoiceDetail(template: TemplateRef<any>) {
    this.invoiceDetailOptionsModalRef.hide();
    this.deleteInvoiceDetailModalRef = this.modalService.show(template);
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

  deleteInvoiceDetailConfirmed(): void {
    this.invoiceDetailsClient.delete(this.selectedDetail.id).subscribe(
      () => {
        this.deleteInvoiceDetailModalRef.hide();
        this.selectedInvoice.invoiceDetails = this.selectedInvoice.invoiceDetails.filter(d => d.id != this.selectedDetail.id);
      },
      error => console.error(error)
    );
  }

  disableProduct(id: number): boolean {
    return this.selectedInvoice.invoiceDetails.find(i => i.product.id == id) == undefined ? false : true;
  }

  getLatestProductPrice(): void {
    this.productPricesClient.get().subscribe(
      result => { this.productPriceList = result.productPrices });
  }

  newInvoiceCancelled(): void {
    this.newInvoiceModalRef.hide();
    this.newInvoiceEditor = {};
  }

  showInvoiceDetailOptionsModal(template: TemplateRef<any>, detail: InvoiceDetailDto): void {
    this.selectedDetail = detail;
    this.invoiceDetailOptionsEditor = {
      id: this.selectedDetail.id,
      invoiceId: this.selectedInvoice.id,
      amount: this.selectedDetail.amount,
      productId: this.selectedDetail.product.id,
      productPrice: this.selectedDetail.productPrice
    };

    this.invoiceDetailOptionsModalRef = this.modalService.show(template);
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

  showNewInvoiceDetailModal(template: TemplateRef<any>) {
    this.newInvoiceDetailModalRef = this.modalService.show(template);
  }

  showNewInvoiceModal(template: TemplateRef<any>): void {
    this.newInvoiceEditor.dateInvoice = new Date();
    this.newInvoiceModalRef = this.modalService.show(template);
  }

  updateInvoice() {
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
      },
      error => console.error(error)
    );
  }

  updateInvoiceDetail() {
    this.invoiceDetailsClient.update(this.selectedDetail.id, <UpdateInvoiceDetailCommand>{
      id: this.invoiceDetailOptionsEditor.id,
      amount: this.invoiceDetailOptionsEditor.amount,
      productId: this.invoiceDetailOptionsEditor.productId,
      productPrice: this.invoiceDetailOptionsEditor.productPrice
    }).subscribe(
      () => {
        this.selectedDetail.amount = this.invoiceDetailOptionsEditor.amount;
        this.selectedDetail.productPrice = this.invoiceDetailOptionsEditor.productPrice;
        this.selectedDetail.product = this.productList.find(p => p.id == this.invoiceDetailOptionsEditor.productId);

        this.invoiceDetailOptionsModalRef.hide();
        this.invoiceDetailOptionsEditor = {};
      },
      error => console.error(error)
    );
  }
}

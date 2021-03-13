import { CurrencyPipe } from '@angular/common';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
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

  count = 0;
  date = new Date();
  debug = false;
  deleteInvoiceDetailModalRef: BsModalRef;
  deleteInvoiceModalRef: BsModalRef;
  faEllipsisH = faEllipsisH;
  faPencilAlt = faPencilAlt;
  faPlus = faPlus;
  invoiceDetailList: InvoiceDetailDto[] = [];
  invoiceDetailOptionsForm: FormGroup;
  invoiceDetailOptionsModalRef: BsModalRef;
  invoiceList: any;
  invoiceOptionsEditor: any = {};
  invoiceOptionsModalRef: BsModalRef;
  newInvoiceDetailForm: FormGroup;
  newInvoiceDetailModalRef: BsModalRef;
  newInvoiceEditor: any = {};
  newInvoiceModalRef: BsModalRef;
  page = 1;
  pageSize = 3;
  pageSizeOptions = [3, 5, 10, 15, 20];
  place: PlaceDto;
  placeList: PlaceDto[];
  productList: ProductDto[];
  productPriceList: ProductPriceDto[];
  providerList: ProviderDto[];
  searchFilterForm: FormGroup;
  selectedInvoice: InvoiceDto;
  selectedDetail: InvoiceDetailDto;
  vm: InvoicesVm;

  constructor(
    private currencyPipe: CurrencyPipe,
    private fb: FormBuilder,
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
    this.searchFilterForm = this.fb.group({
      startDate: [new Date(this.date.getFullYear(), this.date.getMonth(), 1), Validators.required],
      endDate: [new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0), Validators.required],
      placeFilter: [[], Validators.required],
      providerFilter: [[], Validators.required],
    });

    this.newInvoiceDetailForm = this.fb.group({
      product: ['', Validators.required],
      amount: ['', Validators.required],
      productPrice: ['', Validators.required]
    });

    this.invoiceDetailOptionsForm = this.fb.group({
      productId: ['', Validators.required],
      amount: ['', Validators.required],
      productPrice: ['', Validators.required]
    });

    this.invoiceDetailOptionsForm.valueChanges.subscribe(form => {
      if (form.productPrice) {
        this.invoiceDetailOptionsForm.patchValue({
          productPrice: this.currencyPipe.transform(form.productPrice.replace(/\D/g, '').replace(/^0+/, ''), 'COP', '$ ', '1.0-0')
        }, { emitEvent: false });
      }
      if (form.amount) {
        this.invoiceDetailOptionsForm.patchValue({
          amount: this.currencyPipe.transform(form.amount.replace(/\D/g, '').replace(/^0+/, ''), ' ', 'code', '1.0-0')
        }, { emitEvent: false });
      }
    });

    this.newInvoiceDetailForm.valueChanges.subscribe(form => {
      if (form.productPrice) {
        this.newInvoiceDetailForm.patchValue({
          productPrice: this.currencyPipe.transform(form.productPrice.replace(/\D/g, '').replace(/^0+/, ''), 'COP', '$ ', '1.0-0')
        }, { emitEvent: false });
      }
      if (form.amount) {
        this.newInvoiceDetailForm.patchValue({
          amount: this.currencyPipe.transform(form.amount.replace(/\D/g, '').replace(/^0+/, ''), ' ', 'code', '1.0-0')
        }, { emitEvent: false });
      }
    });
  }

  addInvoice(): void {
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
        this.cancelNewInvoice()
      },
      error => {
        let errors = JSON.parse(error.response);
        if (errors && errors.Title)
          this.newInvoiceEditor.error = errors.Title[0];
      }
    );
  }

  addInvoiceDetail() {
    this.newInvoiceDetailForm.value;
    let detail = InvoiceDetailDto.fromJS({
      id: 0,
      invoiceId: this.selectedInvoice.id,
      amount: Number(this.newInvoiceDetailForm.value.amount.replace(/\D/g, '').replace(/^0+/, '')),
      product: this.newInvoiceDetailForm.value.product,
      productPrice: Number(this.newInvoiceDetailForm.value.productPrice.replace(/\D/g, '').replace(/^0+/, ''))
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
        var previousProduct = this.productPriceList.find(pp => pp.productId == this.selectedDetail.product.id);
        var previousProductPrice = previousProductPrice == undefined ? 0 : previousProduct.price;


        if (this.selectedDetail.productPrice != previousProductPrice) {
          this.productPricesClient.create(<CreateProductPriceCommand>{
            placeId: this.selectedInvoice.place.id,
            productId: detail.product.id,
            price: detail.productPrice
          }).subscribe(result => { this.getLatestProductPrice(); }, error => console.error(error));
        }

        this.cancelNewInvoiceDetail();
      },
      error => console.error(error)
    );
  }

  cancelInvoiceOptions(): void {
    this.invoiceOptionsModalRef.hide();
    this.invoiceOptionsEditor = {};
  }

  cancelInvoiceDetailOptions(): void {
    this.invoiceDetailOptionsModalRef.hide();
    this.invoiceDetailOptionsForm.setValue(
      {
        product: '',
        amount: '',
        productPrice: '',
      }, { emitEvent: false }
    );
  }

  cancelNewInvoice(): void {
    this.newInvoiceModalRef.hide();
    this.newInvoiceEditor = {};
  }

  cancelNewInvoiceDetail(): void {
    this.newInvoiceDetailModalRef.hide();
    this.newInvoiceDetailForm.setValue(
      {
        product: '',
        amount: '',
        productPrice: '',
      }, { emitEvent: false }
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

  onPageDataChange(event): void {
    this.page = event;
  }

  onPageSizeChange(event): void {
    this.pageSize = event;
    this.page = 1;
  }

  searchFilter() {
    var filteredItem;
    var filteredByPlaceList = [];
    var filteredByProviderList = [];
    var invoicesFilteredList = [];

    this.invoicesClient.get().subscribe(result => {
      this.vm = result;

      if (this.searchFilterForm.value.placeFilter.length || this.searchFilterForm.value.providerFilter.length) {
        if (this.searchFilterForm.value.placeFilter.length) {
          this.searchFilterForm.value.placeFilter.forEach(function (value) {
            filteredItem = result.invoices.filter(i => i.place.id == value.id);
            filteredByPlaceList = filteredByPlaceList.concat(filteredItem);
          });
        }

        if (this.searchFilterForm.value.providerFilter.length) {
          this.searchFilterForm.value.providerFilter.forEach(function (value) {
            filteredItem = result.invoices.filter(i => i.provider.id == value.id);
            filteredByProviderList = filteredByProviderList.concat(filteredItem);
          });
        }
        invoicesFilteredList = filteredByPlaceList.concat(filteredByProviderList);
      }
      else {
        invoicesFilteredList = result.invoices;
      }

      this.vm.invoices = invoicesFilteredList.filter(i => i.dateInvoice >= this.searchFilterForm.value.startDate)
        .filter(i => i.dateInvoice <= this.searchFilterForm.value.endDate);

      this.selectedInvoice = undefined;
    });
  }

  showInvoiceDetailOptionsModal(template: TemplateRef<any>, detail: InvoiceDetailDto): void {
    this.selectedDetail = detail;

    this.invoiceDetailOptionsForm.setValue(
      {
        productId: this.selectedDetail.product.id,
        amount: this.currencyPipe.transform(this.selectedDetail.amount, ' ', 'code', '1.0-0'),
        productPrice: this.currencyPipe.transform(this.selectedDetail.productPrice, 'COP', '$ ', '1.0-0'),
      }, { emitEvent: false }
    );

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
        this.cancelInvoiceOptions();
      },
      error => console.error(error)
    );
  }

  updateInvoiceDetail() {
    this.invoiceDetailsClient.update(this.selectedDetail.id, <UpdateInvoiceDetailCommand>{
      id: this.selectedDetail.id,
      amount: Number(this.invoiceDetailOptionsForm.value.amount.replace(/\D/g, '').replace(/^0+/, '')),
      productId: this.invoiceDetailOptionsForm.value.productId,
      productPrice: Number(this.invoiceDetailOptionsForm.value.productPrice.replace(/\D/g, '').replace(/^0+/, ''))
    }).subscribe(
      () => {
        this.selectedDetail.amount = Number(this.invoiceDetailOptionsForm.value.amount.replace(/\D/g, '').replace(/^0+/, ''));
        this.selectedDetail.productPrice = Number(this.invoiceDetailOptionsForm.value.productPrice.replace(/\D/g, '').replace(/^0+/, ''));
        this.selectedDetail.product = this.productList.find(p => p.id == this.invoiceDetailOptionsForm.value.productId);

        this.cancelInvoiceDetailOptions();
      },
      error => console.error(error)
    );
  }
}

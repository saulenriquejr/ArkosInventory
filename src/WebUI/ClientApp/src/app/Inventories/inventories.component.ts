import { CurrencyPipe } from '@angular/common';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { faPlus, faEllipsisH, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  InventoryDto, InventoriesClient, InventoriesVm, CreateInventoryCommand, UpdateInventoryCommand,
  InventoryDetailDto, InventoryDetailsClient, CreateInventoryDetailCommand,
  PlacesClient, PlaceDto, InvoicesClient, InvoiceDetailDto, ProductsClient, ProductPricesClient, ProductDto, ProductPriceDto,
  ProvidersClient, ProviderDto, InvoicesVm, InvoiceDto,
  InvoiceDetailsClient, InvoiceDetail
} from '../arkos-api';
import { Data } from 'ngx-bootstrap/positioning/models';
import { moment } from 'ngx-bootstrap/chronos/test/chain';

@Component({
  selector: 'app-inventories',
  templateUrl: './inventories.component.html',
  styleUrls: ['./inventories.component.css']
})
export class InventoriesComponent implements OnInit {

  count = 0;
  date = new Date();
  debug = false;
  deleteInventoryDetailModalRef: BsModalRef;
  deleteInventoryModalRef: BsModalRef;
  faPlus = faPlus;
  faEllipsisH = faEllipsisH;
  faPencilAlt = faPencilAlt;
  inventoryDetailList: InvoiceDetailDto[] = [];
  inventoryDetailOptionsEditor: any = {};
  inventoryDetailOptionsForm: FormGroup;
  inventoryDetailOptionsModalRef: BsModalRef;
  inventoryList: InventoryDto[];
  inventoryOptionsEditor: any = {};
  inventoryOptionsModalRef: BsModalRef;
  invoiceList: InvoiceDto[];
  newInventoryDetailEditor: any = {};
  newInventoryDetailForm: FormGroup;
  newInventoryDetailModalRef: BsModalRef;
  newInventoryEditor: any = {};
  newInventoryModalRef: BsModalRef;
  page = 1;
  pageSize = 3;
  pageSizeOptions = [3, 5, 10, 15, 20];
  place: PlaceDto;
  placeList: PlaceDto[];
  productList: ProductDto[];
  productPriceList: ProductPriceDto[];
  providerList: ProviderDto[];
  searchFilterForm: FormGroup;
  selectedDetail: InventoryDetailDto;
  selectedInventory: InventoryDto;
  vm: InventoriesVm;

  constructor(
    private currencyPipe: CurrencyPipe,
    private fb: FormBuilder,
    private inventoriesClient: InventoriesClient,
    private inventoryDetailsClient: InventoryDetailsClient,
    private invoicesClient: InvoicesClient,
    private invoiceDetailsClient: InvoiceDetailsClient,
    private modalService: BsModalService,
    private placesClient: PlacesClient,
    private productPricesClient: ProductPricesClient,
    private productsClient: ProductsClient,
    private providerClient: ProvidersClient
  ) {
    this.inventoriesClient.get().subscribe(result => {
      this.vm = result;
      if (this.vm.inventories.length) {
        this.selectedInventory = this.vm.inventories[0];
      }
    });

    this.invoicesClient.get().subscribe(
      result => { this.invoiceList = result.invoices });

    this.placesClient.get().subscribe(
      result => { this.placeList = result.places });

    this.productPricesClient.get().subscribe(
      result => { this.productPriceList = result.productPrices });

    this.productsClient.get().subscribe(
      result => { this.productList = result.products });

    this.providerClient.get().subscribe(
      result => { this.providerList = result.providers });
  }

  ngOnInit(): void {
    this.searchFilterForm = this.fb.group({
      startDate: [new Date(this.date.getFullYear(), this.date.getMonth(), 1), Validators.required],
      endDate: [new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0), Validators.required],
      placeFilter: [[], Validators.required]
    });

    this.newInventoryDetailForm = this.fb.group({
      product: new FormControl(''),
      manualCount: ['', Validators.required],
      currentPrice: ['', Validators.required]
    });

    this.inventoryDetailOptionsForm = this.fb.group({
      productId: ['', Validators.required],
      manualCount: ['', Validators.required],
      currentPrice: ['', Validators.required]
    });

    this.inventoryDetailOptionsForm.valueChanges.subscribe(form => {
      if (form.product) {
        this.newInventoryDetailForm.patchValue({
          currentPrice: this.currencyPipe.transform(this.productPriceList.find(pp => pp.productId == form.product.id).price, 'COP', '$ ', '1.0-0')
        }, { emitEvent: false });
        form.currentPrice = this.newInventoryDetailForm.value.currentPrice;
      }

      if (form.currentPrice) {
        this.inventoryDetailOptionsForm.patchValue({
          currentPrice: this.currencyPipe.transform(form.currentPrice.replace(/\D/g, '').replace(/^0+/, ''), 'COP', '$ ', '1.0-0')
        }, { emitEvent: false });
      }
      if (form.manualCount) {
        this.inventoryDetailOptionsForm.patchValue({
          manualCount: this.currencyPipe.transform(form.manualCount.replace(/\D/g, '').replace(/^0+/, ''), ' ', 'code', '1.0-0')
        }, { emitEvent: false });
      }
    });


    this.newInventoryDetailForm.get("product").valueChanges.subscribe(form => {
      if (form.name) {
        this.newInventoryDetailForm.patchValue({
          currentPrice: this.currencyPipe.transform(this.productPriceList.find(pp => pp.productId == form.id).price, 'COP', '$ ', '1.0-0')
        }, { emitEvent: false });
        form.currentPrice = this.newInventoryDetailForm.value.currentPrice;
      }
    });

    this.newInventoryDetailForm.valueChanges.subscribe(form => {
      if (form.currentPrice) {
        this.newInventoryDetailForm.patchValue({
          currentPrice: this.currencyPipe.transform(form.currentPrice.replace(/\D/g, '').replace(/^0+/, ''), 'COP', '$ ', '1.0-0')
        }, { emitEvent: false });
      }
      if (form.manualCount) {
        this.newInventoryDetailForm.patchValue({
          manualCount: this.currencyPipe.transform(form.manualCount.replace(/\D/g, '').replace(/^0+/, ''), ' ', 'code', '1.0-0')
        }, { emitEvent: false });
      }
    });
  }

  addInventory(): void {
    let inventory = InventoryDto.fromJS({
      id: 0,
      inventoryDate: this.newInventoryEditor.inventoryDate,
      place: this.newInventoryEditor.place,
      inventoryDetails: []
    });

    this.inventoriesClient.create(<CreateInventoryCommand>{
      inventoryDate: this.newInventoryEditor.inventoryDate,
      placeId: this.newInventoryEditor.place.id,
      inventoryDetails: []
    }).subscribe(result => {
      inventory.id = result;
      this.vm.inventories.push(inventory);
      this.selectedInventory = inventory;
      this.newInventoryModalRef.hide();
      this.newInventoryEditor = {};
    }, error => {
      let errors = JSON.parse(error.response);
      if (errors && errors.Title)
        this.newInventoryEditor.error = errors.Title[0];
    });
  }

  addInventoryDetail() {
    var productId = this.newInventoryDetailForm.value.product.id;
    var placeId = this.selectedInventory.place.id;
    var inventoryDate = this.selectedInventory.inventoryDate;
    var lastInventoryDate: Date = new Date("0001-01-01");
    var lastCount = 0;
    var entries = 0;

    this.inventoryList = this.inventoryList.filter(i => i.inventoryDate < inventoryDate).filter(i => i.place.id == placeId);
    for (var i = 0; i < this.inventoryList.length; i++) {
      for (var j = 0; j < this.inventoryList[i].inventoryDetails.length; j++) {
        if (this.inventoryList[i].inventoryDetails[j].productId == productId) {
          lastInventoryDate = this.inventoryList[i].inventoryDate;
          lastCount = this.inventoryList[i].inventoryDetails[j].manualCount;
          break;
        }
      }
      if (lastCount != 0) {
        break;
      }
    }


    this.invoiceList = this.invoiceList.filter(i => i.dateInvoice >= lastInventoryDate).filter(i => i.dateInvoice <= inventoryDate);
    for (var k = 0; k < this.invoiceList.length; k++) {
      for (var l = 0; l < this.invoiceList[k].invoiceDetails.length; l++) {
        if (this.invoiceList[k].invoiceDetails[l].product.id == productId) {
          entries += this.invoiceList[k].invoiceDetails[l].amount;
        }
      }
    }

    let detail = InventoryDetailDto.fromJS({
      id: 0,
      inventoryId: this.selectedInventory.id,
      manualCount: Number(this.newInventoryDetailForm.value.amount.replace(/\D/g, '').replace(/^0+/, '')),
      product: this.newInventoryDetailEditor.product,
      currentPrice: Number(this.newInventoryDetailForm.value.currentPrice.replace(/\D/g, '').replace(/^0+/, '')),
      totalSale: (lastCount + entries - Number(this.newInventoryDetailForm.value.amount.replace(/\D/g, '').replace(/^0+/, ''))) * Number(this.newInventoryDetailForm.value.currentPrice.replace(/\D/g, '').replace(/^0+/, ''))
    });

    this.inventoryDetailsClient.create(<CreateInventoryDetailCommand>{
      inventoryId: detail.inventoryId,
      productId: detail.product.id,
      manualCount: detail.manualCount,
      currentPrice: detail.currentPrice,
      totalSale: detail.totalSale

    }).subscribe(
      result => {
        detail.id = result;
        this.selectedInventory.inventoryDetails.push(detail);
        this.selectedDetail = detail;

        this.newInventoryDetailModalRef.hide();
        this.newInventoryDetailForm.setValue(
          {
            product: '',
            manualCount: '',
            currentPrice: '',
          }, { emitEvent: false }
        );
      },
      error => console.error(error)
    );
  }

  confirmDeleteInventory(template: TemplateRef<any>) {
    this.inventoryOptionsModalRef.hide();
    this.deleteInventoryModalRef = this.modalService.show(template);
  }

  confirmDeleteInventoryDetail(template: TemplateRef<any>) {
    this.inventoryDetailOptionsModalRef.hide();
    this.deleteInventoryDetailModalRef = this.modalService.show(template);
  }

  deleteInventoryConfirmed(): void {
    this.inventoriesClient.delete(this.selectedInventory.id).subscribe(
      () => {
        this.deleteInventoryModalRef.hide();
        this.vm.inventories = this.vm.inventories.filter(t => t.id != this.selectedInventory.id)
        this.selectedInventory = this.vm.inventories.length ? this.vm.inventories[0] : null;
      },
      error => console.error(error)
    );
  }

  deleteInventoryDetailConfirmed(): void {
    this.inventoryDetailsClient.delete(this.selectedDetail.id).subscribe(
      () => {
        this.deleteInventoryDetailModalRef.hide();
        this.selectedInventory.inventoryDetails = this.selectedInventory.inventoryDetails.filter(d => d.id != this.selectedDetail.id);
      },
      error => console.error(error)
    );
  }

  disableProduct(id: number): boolean {
    return this.selectedInventory.inventoryDetails.find(i => i.product.id == id) == undefined ? false : true;
  }

  getLatestProductPrice(): void {
    this.productPricesClient.get().subscribe(
      result => { this.productPriceList = result.productPrices });
  }

  newInventoryCancelled(): void {
    this.newInventoryModalRef.hide();
    this.newInventoryEditor = {};
  }

  onPageDataChange(event): void {
    this.page = event;
  }

  onPageSizeChange(event): void {
    this.pageSize = event;
    this.page = 1;
  }

  searchFilter() {
    var filteredList;
    var inventoriesFilteredList = [];
    this.inventoriesClient.get().subscribe(result => {
      this.vm = result;
      if (this.searchFilterForm.value.placeFilter.length) {
        this.searchFilterForm.value.placeFilter.forEach(function (value) {
          filteredList = result.inventories.filter(i => i.place.id == value.id);
          inventoriesFilteredList = inventoriesFilteredList.concat(filteredList);
        });
      }
      else {
        inventoriesFilteredList = this.vm.inventories;
      }

      this.vm.inventories = inventoriesFilteredList.filter(i => i.inventoryDate >= this.searchFilterForm.value.startDate)
        .filter(i => i.inventoryDate <= this.searchFilterForm.value.endDate);

      this.selectedInventory = undefined;
    });
  }

  showInventoryDetailOptionsModal(template: TemplateRef<any>, detail: InventoryDetailDto): void {
    this.selectedDetail = detail;

    this.inventoryDetailOptionsForm.setValue(
      {
        productId: this.selectedDetail.product.id,
        manualCount: this.currencyPipe.transform(this.selectedDetail.manualCount, ' ', 'code', '1.0-0'),
        currentPrice: this.currencyPipe.transform(this.selectedDetail.currentPrice, 'COP', '$ ', '1.0-0'),
      }, { emitEvent: false }
    );

    this.inventoriesClient.get().subscribe(result => {
      this.inventoryList = result.inventories;
      this.inventoryDetailOptionsModalRef = this.modalService.show(template);
    });

  }

  showInventoryOptionsModal(template: TemplateRef<any>) {
    this.inventoryOptionsEditor = {
      id: this.selectedInventory.id,
      inventoryDate: this.selectedInventory.inventoryDate,
      placeId: this.selectedInventory.place.id
    };

    this.inventoryOptionsModalRef = this.modalService.show(template);
  }

  showNewInventoryDetailModal(template: TemplateRef<any>) {
    this.inventoriesClient.get().subscribe(result => {
      this.inventoryList = result.inventories;
      this.newInventoryDetailModalRef = this.modalService.show(template);
    });
  }

  showNewInventoryModal(template: TemplateRef<any>): void {
    this.newInventoryEditor.inventoryDate = new Date();
    this.newInventoryModalRef = this.modalService.show(template);
  }

  updateInventory() {
    this.inventoriesClient.update(this.selectedInventory.id, <UpdateInventoryCommand>{
      id: this.inventoryOptionsEditor.id,
      inventoryDate: this.inventoryOptionsEditor.inventoryDate,
      placeId: this.inventoryOptionsEditor.placeId
    }).subscribe(
      () => {
        this.selectedInventory.inventoryDate = this.inventoryOptionsEditor.inventoryDate;
        this.selectedInventory.place = this.placeList.find(pl => pl.id == this.inventoryOptionsEditor.placeId);
        this.inventoryOptionsModalRef.hide();
        this.inventoryOptionsEditor = {};
      },
      error => console.error(error)
    );
  }

  //updateInventoryDetail() {
  //  this.inventoryDetailsClient.update(this.selectedDetail.id, <UpdateInventoryDetailCommand>{
  //    id: this.selectedDetail.id,
  //    manualCount: this.inventoryDetailOptionsEditor.amount,
  //    productId: this.inventoryDetailOptionsEditor.productId,
  //    productPrice: this.inventoryDetailOptionsEditor.productPrice
  //  }).subscribe(
  //    () => {
  //      this.selectedDetail.amount = this.inventoryDetailOptionsEditor.amount;
  //      this.selectedDetail.productPrice = this.inventoryDetailOptionsEditor.productPrice;
  //      this.selectedDetail.product = this.productList.find(p => p.id == this.inventoryDetailOptionsEditor.productId);

  //      this.inventoryDetailOptionsModalRef.hide();
  //      this.inventoryDetailOptionsEditor = {};
  //    },
  //    error => console.error(error)
  //  );
  //}
}

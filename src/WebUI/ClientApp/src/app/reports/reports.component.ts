import { CurrencyPipe } from '@angular/common';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { faPlus, faEllipsisH, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  InventoryDto, InventoriesClient, InventoriesVm,
  InventoryDetailDto, PlaceDto, InvoiceDetailDto, ProductDto, ProductPriceDto, ProviderDto, InvoiceDto, 
} from '../arkos-api';
import { Data } from 'ngx-bootstrap/positioning/models';
import { moment } from 'ngx-bootstrap/chronos/test/chain';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

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
    private fb: FormBuilder,
    private inventoriesClient: InventoriesClient
  ) {
    this.inventoriesClient.get().subscribe(result => {
      this.vm = result;
      if (this.vm.inventories.length) {
        this.selectedInventory = this.vm.inventories[0];
      }
    });
  }

  ngOnInit(): void {
    this.searchFilterForm = this.fb.group({
      startDate: [new Date(this.date.getFullYear(), this.date.getMonth(), 1), Validators.required],
      endDate: [new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0), Validators.required],
      placeFilter: [[], Validators.required]
    });
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
}

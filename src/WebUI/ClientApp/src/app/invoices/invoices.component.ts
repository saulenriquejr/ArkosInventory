import { Component, OnInit, TemplateRef } from '@angular/core';
import { faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PlacesClient, PlaceDto, InvoicesClient, CreateInvoiceDetailDto, ProductsClient } from '../arkos-api';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {

  debug = false;
  validInvoiceDetail: boolean = false;
  //m: InvoicesVm;
  newInvoiceEditor: any = {};
  newInvoiceDetailEditor: any = {};
  newInvoiceDetailModalRef: BsModalRef;
  place: PlaceDto;
  faPlus = faPlus;
  faEllipsisH = faEllipsisH;

  constructor(
    private modalService: BsModalService,
    private placesClient: PlacesClient,
    private productsClient: ProductsClient
  ) { }

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
    this.placesClient.get().subscribe(
      result => {
        this.place = result.places.find(c => c.name === this.newInvoiceEditor.localName);
        if (this.place !=null) {
          //let invoice = InvoiceDto.fromJS({
          //  id: 0,
          //  dateInvoice: place.name,
          //  placeId: place.id
          //});
          this.newInvoiceDetailModalRef = this.modalService.show(template);
          setTimeout(() => document.getElementById("product").focus(), 250);
        }
      }
    );
  }

  validateInvoiceDetail() {
    //this.productsClient.get().subscribe(
    //  result => {
    //    this.product = result.products.filter(p =>p.)
    //    if (this.place != null) {
    //    }
    //  }
    //);
    this.addInvoice();
  }

  addInvoice(): void {

    //this.listsClient.create(<CreateTodoListCommand>{ title: this.newListEditor.title }).subscribe(
    //  result => {
    //    list.id = result;
    //    this.vm.lists.push(list);
    //    this.selectedList = list;
    //    this.newListModalRef.hide();
    //    this.newListEditor = {};
    //  },
    //  error => {
    //    let errors = JSON.parse(error.response);

    //    if (errors && errors.Title) {
    //      this.newInvoiceEditor.error = errors.Title[0];
    //    }

    //    setTimeout(() => document.getElementById("title").focus(), 250);
    //  }
    //);
  }
}

import { Component, TemplateRef } from '@angular/core';
import { ProductsVm, ProductDto, ProductsClient, CreateProductCommand, UpdateProductCommand } from '../arkos-api';
import { faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-products-admin',
  templateUrl: './products-admin.component.html',
  styleUrls: ['./products-admin.component.css']
})
export class ProductsAdminComponent {

  debug = false;

  vm: ProductsVm;

  selectedProduct: ProductDto;

  newProductEditor: any = {};

  newProductModalRef: BsModalRef;

  faPlus = faPlus;
  faEllipsisH = faEllipsisH;

  productsList: ProductDto[];

  constructor(private productsClient: ProductsClient, private modalService: BsModalService) {
    productsClient.get().subscribe(
      result => {
        this.vm = result;
        if (this.vm.products.length) {
          this.productsList = this.vm.products;
        }
      }
    );
  }

  showNewProductModal(template: TemplateRef<any>): void {
    this.newProductModalRef = this.modalService.show(template);
    setTimeout(() => document.getElementById("name").focus(), 250);
  }

  newProductCancelled(): void {
    this.newProductModalRef.hide();
    this.newProductEditor = {};
  }

  addProduct(): void {
    const product = ProductDto.fromJS({
      id: 0,
      name: this.newProductEditor.name
    });

    this.productsClient.create(
      <CreateProductCommand>{
        name: this.newProductEditor.name
      }
    ).subscribe(
      result => {
        product.id = result;
        this.vm.products.push(product);
        this.vm.products.sort((a, b) => (a.name > b.name) ? 1 : -1)
        this.newProductModalRef.hide();
        this.newProductEditor = {};
      },
      error => {
        const errors = JSON.parse(error.response);

        if (errors && errors.Title) {
          this.newProductEditor.error = errors.Title[0];
        }

        setTimeout(() => document.getElementById("name").focus(), 250);
      }
    );
  }

  editProduct(product: ProductDto, inputId: string): void {
    this.selectedProduct = product;
    setTimeout(() => document.getElementById(inputId).focus(), 100);
  }

  updateProduct(product: ProductDto, pressedEnter: false): void {
    const isNewProduct = product.id === 0;

    if (!product.name.trim()) {
      //this.deleteProduct(product);
      return;
    }

    if (product.id === 0) {
      this.productsClient.create(CreateProductCommand.fromJS({ ...product, productId: this.selectedProduct.id }))
        .subscribe(
          result => {
            product.id = result;
          },
          error => console.error(error)
        );
    } else {
      this.productsClient.update(product.id, UpdateProductCommand.fromJS(product))
        .subscribe(
          () => console.log('Update succeeded.'),
          error => console.error(error)
        );
    }

    this.selectedProduct = null;

    if (isNewProduct && pressedEnter) {
      this.addProduct();
    }
  }

  // Delete product
  deleteProduct(product: ProductDto) {
    if (product.id === 0) {
      const productIndex = this.productsList.indexOf(this.selectedProduct);
      this.productsList.splice(productIndex, 1);
    } else {
      this.productsClient.delete(product.id).subscribe(
        () => this.productsList = this.productsList.filter(t => t.id !== product.id),
        error => console.error(error)
      );
    }
  }
}

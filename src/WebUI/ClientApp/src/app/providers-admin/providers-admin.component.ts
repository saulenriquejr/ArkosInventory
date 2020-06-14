import { Component, TemplateRef } from '@angular/core';
import { ProvidersVm, ProviderDto, ProvidersClient, CreateProviderCommand, UpdateProviderCommand } from '../arkos-api';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-providers-admin',
  templateUrl: './providers-admin.component.html',
  styleUrls: ['./providers-admin.component.css']
})
export class ProvidersAdminComponent {

  debug = false;

  vm: ProvidersVm;

  selectedProvider: ProviderDto;

  newProviderEditor: any = {};

  newProviderModalRef: BsModalRef;

  faPlus = faPlus;
  faEllipsisH = faEllipsisH;

  providersList: ProviderDto[];

  constructor(private providersClient: ProvidersClient, private modalService: BsModalService) {
    providersClient.get().subscribe(
      result => {
        this.vm = result;
        if (this.vm.providers.length) {
          this.providersList = this.vm.providers;
        }
      }
    );
  }

  showNewProviderModal(template: TemplateRef<any>): void {
    this.newProviderModalRef = this.modalService.show(template);
    setTimeout(() => document.getElementById("name").focus(), 250);
  }

  newProviderCancelled(): void {
    this.newProviderModalRef.hide();
    this.newProviderEditor = {};
  }

  addProvider(): void {
    const provider = ProviderDto.fromJS({
      id: 0,
      name: this.newProviderEditor.name
    });

    this.providersClient.create(
      <CreateProviderCommand>{
        name: this.newProviderEditor.name
      }
    ).subscribe(
      result => {
        provider.id = result;
        this.vm.providers.push(provider);
        this.vm.providers.sort((a, b) => (a.name > b.name) ? 1 : -1)
        this.newProviderModalRef.hide();
        this.newProviderEditor = {};
      },
      error => {
        const errors = JSON.parse(error.response);

        if (errors && errors.Title) {
          this.newProviderEditor.error = errors.Title[0];
        }

        setTimeout(() => document.getElementById("name").focus(), 250);
      }
    );
  }

  editProvider(provider: ProviderDto, inputId: string): void {
    this.selectedProvider = provider;
    setTimeout(() => document.getElementById(inputId).focus(), 100);
  }

  updateProvider(provider: ProviderDto, pressedEnter: false): void {
    const isNewProvider = provider.id === 0;

    if (!provider.name.trim()) {
      //this.deleteProvider(provider);
      return;
    }

    if (provider.id === 0) {
      this.providersClient.create(CreateProviderCommand.fromJS({ ...provider, providerId: this.selectedProvider.id }))
        .subscribe(
          result => {
            provider.id = result;
          },
          error => console.error(error)
        );
    } else {
      this.providersClient.update(provider.id, UpdateProviderCommand.fromJS(provider))
        .subscribe(
          () => console.log('Update succeeded.'),
          error => console.error(error)
        );
    }

    this.selectedProvider = null;

    if (isNewProvider && pressedEnter) {
      this.addProvider();
    }
  }

  // Delete provider
  deleteProvider(provider: ProviderDto) {
    return;
    //if (provider.id === 0) {
    //  const providerIndex = this.providersList.indexOf(this.selectedProvider);
    //  this.providersList.splice(providerIndex, 1);
    //} else {
    //  this.providersClient.delete(provider.id).subscribe(
    //    () => this.providersList = this.providersList.filter(t => t.id !== provider.id),
    //    error => console.error(error)
    //  );
    //}
  }


}

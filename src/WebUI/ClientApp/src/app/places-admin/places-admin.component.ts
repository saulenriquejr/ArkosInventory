import { Component } from '@angular/core';
import { PlacesVm, PlacesClient, PlaceDto } from '../arkos-api';
import { faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-places-admin',
  templateUrl: './places-admin.component.html',
  styleUrls: ['./places-admin.component.css']
})
export class PlacesAdminComponent {

  vm: PlacesVm;

  placesList: PlaceDto[];

  faPlus = faPlus;
  faEllipsisH = faEllipsisH;

  constructor(placesClient: PlacesClient) {
    placesClient.get().subscribe(
      result => {
        this.vm = result;
        if (this.vm.places.length) {
          this.placesList = this.vm.places;
        }
      }
    );
  }
}

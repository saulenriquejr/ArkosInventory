import { Component, OnInit } from '@angular/core';
import { PlacesVm, PlacesClient, PlaceDto } from '../arkos-api';
import { faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-places-admin',
  templateUrl: './places-admin.component.html',
  styleUrls: ['./places-admin.component.css']
})
export class PlacesAdminComponent implements OnInit {

  vm: PlacesVm;

  placesList: PlaceDto[];

  faPlus = faPlus;
  faEllipsisH = faEllipsisH;

  constructor(private placesClient: PlacesClient,
    private modalService: BsModalService) {
    placesClient.get().subscribe(
      result => {
        this.vm = result;
        if (this.vm.places.length) {
          this.placesList = this.vm.places;
        }
      }
    );
  }

  ngOnInit(): void {
  }

}

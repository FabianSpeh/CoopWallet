import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-edit-owner',
  templateUrl: './edit-owner.component.html',
  styleUrls: ['./edit-owner.component.css']
})
export class EditOwnerComponent {

@ViewChild('nameOfOwner') nameOfOwnerElement: any;
@ViewChild('errorMessage') errorMessage: any;

ownerName: any;
ownerList: any;

  constructor(public activeModal: NgbActiveModal) {
this.ownerList = {
  name: [],
  address: []
};



  }

  change(): any {
    if (this.nameOfOwnerElement.nativeElement.value === ''){

      this.errorMessage.nativeElement.hidden = false;

    }
    else{


    }
  }


  async addOwnersToLocalStorage(): Promise<any> {
    if (localStorage.getItem('Owners') != null) {
      this.ownerList = JSON.parse(localStorage.getItem('Owners') || '{}');
    }

  }



}

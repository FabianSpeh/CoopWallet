import {Component, Input, OnInit, AfterViewInit, ViewChild, ViewChildren} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {WalletDetailsComponent} from '../wallet-details/wallet-details.component';
import {OwnerAddressService} from '../owner-address.service';


@Component({
  selector: 'app-edit-owner',
  templateUrl: './edit-owner.component.html',
  styleUrls: ['./edit-owner.component.css']
})
export class EditOwnerComponent implements AfterViewInit, OnInit {

@ViewChild('nameOfOwner') nameOfOwnerElement: any;
@ViewChild('errorMessage') errorMessage: any;
@ViewChildren(WalletDetailsComponent)
private walletDetailComponent!: WalletDetailsComponent;

ownerName: any;
ownerAddress: any;
ownerList: any;


  constructor(public activeModal: NgbActiveModal, private ownerService: OwnerAddressService) {
this.ownerList = {
  name: [],
  address: []
};



  }
  ngOnInit(): void {

    this.ownerService.currentAddress.subscribe(address => this.ownerAddress = address);

  }

  ngAfterViewInit(): void {

  }

  change(): any {
    if (this.nameOfOwnerElement.nativeElement.value === ''){

      this.errorMessage.nativeElement.hidden = false;

    }
    else{

    this.addOwnersToLocalStorage();
    this.activeModal.close();
    }
  }


  async addOwnersToLocalStorage(): Promise<any> {
    if (localStorage.getItem('Owners') != null) {
      this.ownerList = JSON.parse(localStorage.getItem('Owners') || '{}');
    }
    this.ownerName = this.nameOfOwnerElement.nativeElement.value;
    for (let i = 0; i <= this.ownerList.address.length; i++){
      console.log(i);
    if (this.ownerAddress === this.ownerList.address[i]){

      this.ownerList.name[i] = this.ownerName;
      localStorage.setItem('Owners', JSON.stringify(this.ownerList));
      return;
    }

    }

    this.ownerList.name.push(this.ownerName);
    this.ownerList.address.push(this.ownerAddress);

    localStorage.setItem('Owners', JSON.stringify(this.ownerList));


  }



}

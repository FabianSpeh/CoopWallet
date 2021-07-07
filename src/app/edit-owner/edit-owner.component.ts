import {ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {WalletDetailsComponent} from '../wallet-details/wallet-details.component';
import {OwnerAddressService} from '../services/owner-address.service';
import {OwnerService} from '../services/owner.service';

declare var window: any;

@Component({
  selector: 'app-edit-owner',
  templateUrl: './edit-owner.component.html',
  styleUrls: ['./edit-owner.component.css'],
  providers: [NgbActiveModal]
})
export class EditOwnerComponent implements  OnInit {

@ViewChild('nameOfOwner') nameOfOwnerElement: any;
@ViewChild('errorMessage') errorMessage: any;
@ViewChildren(WalletDetailsComponent)
private walletDetailComponent!: WalletDetailsComponent;

ownerName: any;
ownerAddress: any;
ownerList: any;

  constructor(public activeModal: NgbActiveModal, private ownerService: OwnerAddressService, public changeDetectorRef: ChangeDetectorRef,
              public  ownerArraySevice: OwnerService, public modalService: NgbModal) {
    /**
     * ownerList contains all owners
     */
this.ownerList = {
  name: [],
  address: []
};

  }
  ngOnInit(): void {

    this.ownerService.currentAddress.subscribe(address => this.ownerAddress = address);

  }

  change(): any {
    if (this.nameOfOwnerElement.nativeElement.value === ''){

      this.errorMessage.nativeElement.hidden = false;

    }
    else{

    this.addOwnersToLocalStorage();
    this.activeModal.close();
    this.changeDetectorRef.detectChanges();
    }
  }

  /**
   * parses the Local Storage entry with the key "Owners" and pushes a newly added Owner onto it
   */
  async addOwnersToLocalStorage(): Promise<any> {
    if (localStorage.getItem('Owners') != null) {
      this.ownerList = JSON.parse(localStorage.getItem('Owners') || '{}');
    }
    this.ownerName = this.nameOfOwnerElement.nativeElement.value;
    for (let i = 0; i <= this.ownerList.address.length; i++){
      if (this.ownerAddress === this.ownerList.address[i]){

      this.ownerList.name[i] = this.ownerName;
      this.ownerArraySevice.owners.name[i] = this.ownerName;
      localStorage.setItem('Owners', JSON.stringify(this.ownerList));
      return;
    }
    }
    for ( const owner of this.ownerArraySevice.owners){
      if (owner.address === this.ownerAddress){
        owner.name = this.ownerName;
      }
    }
    this.ownerList.name.push(this.ownerName);
    this.ownerList.address.push(this.ownerAddress);
    console.log(this.ownerArraySevice.owners);
    localStorage.setItem('Owners', JSON.stringify(this.ownerList));
    this.changeDetectorRef.detectChanges();


  }


}

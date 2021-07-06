import {Component, ViewChild} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {MultisigWalletDataService} from '../services/multisig-wallet-data.service';


@Component({
  selector: 'app-add-owner',
  templateUrl: './add-owner.component.html',
  styleUrls: ['./add-owner.component.css'],
  providers: [NgbActiveModal]
})
/**
 * The AddOwnerComponent contains the popup for adding new Owners to a Wallet
 */
export class AddOwnerComponent {

  @ViewChild('addressOfOwner') addressOfOwnerElement: any;
  @ViewChild('errorMessage') errorMessage: any;

  constructor(public activeModal: NgbActiveModal, public walletService: MultisigWalletDataService) {

  }
  /**
   * gets called when the "Add" Button inside the popup is used
   * If the "Address" Field is empty, it shows an error Message
   * Otherwise its add the new Owner to the Wallet
   */
  add(): any {
    if (this.addressOfOwnerElement.nativeElement.value === ''){

      this.errorMessage.nativeElement.hidden = false;

    }
    else{
      const address = this.addressOfOwnerElement.nativeElement.value;
      const contractAddress = (location.href.split('/').pop() as string);
      this.walletService.addOwner(address, contractAddress);

      this.activeModal.close();
    }

  }



}

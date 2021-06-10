import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {MultisigWalletDataService} from '../services/multisig-wallet-data.service';


@Component({
  selector: 'app-add-owner',
  templateUrl: './add-owner.component.html',
  styleUrls: ['./add-owner.component.css']
})
export class AddOwnerComponent {

  @ViewChild('addressOfOwner') addressOfOwnerElement: any;
  @ViewChild('errorMessage') errorMessage: any;

  constructor(public activeModal: NgbActiveModal, public walletService: MultisigWalletDataService) {

  }

  add(): any {
    if (this.addressOfOwnerElement.nativeElement.value === ''){

      this.errorMessage.nativeElement.hidden = false;

    }
    else{
      const address = this.addressOfOwnerElement.nativeElement.value;
      const contractAddress = '0x283011659f9Cd638b4d99EFB264b198917f6Ff5D'

      this.walletService.addOwner(address, contractAddress);

      this.activeModal.close();
    }

  }



}

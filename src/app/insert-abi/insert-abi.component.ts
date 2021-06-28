import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {MultisigWalletDataService} from '../services/multisig-wallet-data.service';


@Component({
  selector: 'app-insert-abi',
  templateUrl: './insert-abi.component.html',
  styleUrls: ['./insert-abi.component.css'],
  providers: [NgbActiveModal]
})
export class InsertAbiComponent {

  @ViewChild('nameOfContract') nameOfContractElement: any;
  @ViewChild('abiOfContract') abiOfContractElement: any;
  @ViewChild('errorMessageContractName') errorMessageContractName: any;
  @ViewChild('errorMessageABIContract') errorMessageABIContract: any;

  constructor(public activeModal: NgbActiveModal, public walletService: MultisigWalletDataService) {

  }

  insert(): any {
    if (this.nameOfContractElement.nativeElement.value === '' || this.abiOfContractElement.nativElement.value === ''){

      // Handles the error case, if there is no contract name given
      if (this.nameOfContractElement.nativeElement.value === '') {
        this.errorMessageContractName.nativeElement.hidden = false;
      }

      // Handle the error case, if there is no contract ABI given
      if (this.abiOfContractElement.nativElement.value === '') {
        this.errorMessageABIContract.nativeElement.hidden = false;
      }
    }
    else{
      this.activeModal.close();
    }

  }



}

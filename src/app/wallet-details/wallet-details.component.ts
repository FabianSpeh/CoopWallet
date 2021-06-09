import {Component, OnInit} from '@angular/core';
import {EditOwnerComponent} from '../edit-owner/edit-owner.component';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {OwnerAddressService} from '../owner-address.service';
import {MultisigWalletDataService} from '../multisig-wallet-data.service';
import {UserWalletDataService} from '../user-wallet-data.service';

@Component({
  selector: 'app-wallet-details',
  templateUrl: './wallet-details.component.html',
  styleUrls: ['./wallet-details.component.css']
})
export class WalletDetailsComponent implements OnInit {
  wallet: any;
  owners: any;
  private ownerAddress: any;
  message: any;
  constructor(private modalService: NgbModal,
              private ownerService: OwnerAddressService,
              public multisigService: MultisigWalletDataService,
              public dataService: UserWalletDataService) {}


  async ngOnInit(): Promise<void> {
    this.wallet = this.loadWallet();
    if (this.wallet !== undefined) {
      this.owners = await this.loadOwnersOfWallet();

    }
    this.ownerService.currentAddress.subscribe(address => this.ownerAddress = address);
  }


  loadWallet(): object {
    const address: string | undefined = location.href.split('/').pop();
    // lookup wallet in local storage
    const wallet: object = {
      name: 'Multisig Wallet',
      address,
      balance: '1000000',
      confirmations: '3',
      owners: '5',
      pending: '0',
      network: 'Kovan'
    };
    return wallet;
  }

  async loadOwnersOfWallet(): Promise<object> {

    await this.multisigService.getOwnerArray(location.href.split('/').pop());
    const ownerArray = this.multisigService.ownerArray;

    const ownersCode: object[] = [];
    for (let i = 0; i < ownerArray.length; i++){
      ownersCode[i] = {name: 'Owner ' + i, address: ownerArray[i]};
    }
    if (this.getOwnersFromLocalStorage() !== undefined){
      const ownerList = this.getOwnersFromLocalStorage();
      for (let i = 0; i < ownerArray.length; i++){
        for (let j = 0; j < ownerList.address.length; j++){

           if (ownerArray[i] === ownerList.address[j]){

            ownersCode[i] = {name: ownerList.name[j], address: ownerList.address[j]};
          }

        }

      }
    }

    return ownersCode;
  }

  open(owner: any): any {
    const modalRef = this.modalService.open(EditOwnerComponent);
    this.ownerAddress = owner.address;
    this.ownerService.changeMessage(owner.address);
  }

  getOwnersFromLocalStorage(): any {
    if (localStorage.getItem('Owners') == null) {
      return;

    }

    const ownerList = JSON.parse(localStorage.getItem('Owners') || '{}' );
    return ownerList;

  }


}

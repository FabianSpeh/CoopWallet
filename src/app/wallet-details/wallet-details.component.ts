import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {EditOwnerComponent} from '../edit-owner/edit-owner.component';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {OwnerAddressService} from '../owner-address.service';

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
  constructor(private modalService: NgbModal, private ownerService: OwnerAddressService) {

  }


  ngOnInit(): void {
    this.wallet = this.loadWallet();
    if (this.wallet !== undefined) {
      this.owners = this.loadOwnersOfWallet();
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

  loadOwnersOfWallet(): object {
    // lookup owners
    const ownersNew: object[] = [];
    let ownerList = this.getOwnersFromLocalStorage();
    console.log(ownerList);
    for (let i = 0; i < ownerList.address.length; i++){
      ownersNew[i] = {name: ownerList.name[i], address: ownerList.address[i]};
    }

    const owners: object = [
      { name: 'Owner 1',
        address: '0x18FwRPMHKAPdNpXmZ93h4r2apyFZbX3Ww4'
      },
      { name: 'Owner 2',
        address: 'abcdefgh'
      },
      { name: 'Owner 3',
        address: '21321312321321321'
      }
    ];
    console.log(owners);
    console.log(ownersNew);
    return ownersNew;
  }

  open(owner: any): any {
    const modalRef = this.modalService.open(EditOwnerComponent);
    this.ownerAddress = owner.address;
    this.ownerService.changeMessage(owner.address);
  }

  getOwnersFromLocalStorage(): any {
   let ownerList = JSON.parse(localStorage.getItem('Owners') || '{}');
   return ownerList;
  }

}

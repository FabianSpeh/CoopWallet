import {MultisigWalletDataService, Wallet} from '../services/multisig-wallet-data.service';
import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {AddOwnerComponent} from '../add-owner/add-owner.component';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-wallet-details',
  templateUrl: './wallet-details.component.html',
  styleUrls: ['./wallet-details.component.css']
})
export class WalletDetailsComponent implements OnInit {

  constructor(public walletService: MultisigWalletDataService, private modalService: NgbModal) { }

  wallet: any;
  owners: any;

  async ngOnInit(): Promise<void> {
    this.wallet = await this.loadWallet();
    if (this.wallet !== undefined) {
      this.owners = this.loadOwnersOfWallet();
    }
  }

  /**
   * Loads the Wallet that is referenced by the URL
   * TODO: implement functionality
   */
  async loadWallet(): Promise<Wallet> {
    const address: string = (location.href.split('/').pop() as string);
    let name = 'Unknown Wallet';
    if (localStorage.getItem('Wallets') != null){
      const wallets = JSON.parse(localStorage.getItem('Wallets') || '{}');
      for (let i = 0; i < wallets.address.length; i++) {
        if (wallets.address[i] === address) {
          name = wallets.name[i];
          break;
        }
      }
    }
    return await this.walletService.getWalletJSON(name, address);
  }

  /**
   * Loads the owners of the Wallet
   * TODO: implement functionality!
   */
  loadOwnersOfWallet(): object {
    // lookup owners
    const owners: object = [
      { name: 'Owner Owner',
        address: '0x18FwRPMHKAPdNpXmZ93h4r2apyFZbX3Ww4'
      },
      { name: 'Owner 2',
        address: '0x18FwRPMHKAPdNpXmZ93h4r2apyFZbX3Ww5'
      },
      { name: 'Owner 3',
        address: '0x18FwRPMHKAPdNpXmZ93h4r2apyFZbX3Ww6'
      }
    ];
    return owners;
  }


  openAddOwnerPopup(): any {
    const modalRef = this.modalService.open(AddOwnerComponent);
  }

  removeOwner(ownerAddress: any, contractAddress: any): any {
    this.walletService.removeOwner(ownerAddress, contractAddress);
  }



}

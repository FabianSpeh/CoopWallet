import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {EditOwnerComponent} from '../edit-owner/edit-owner.component';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-wallet-details',
  templateUrl: './wallet-details.component.html',
  styleUrls: ['./wallet-details.component.css']
})
export class WalletDetailsComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  wallet: any;
  owners: any;


  ngOnInit(): void {
    this.wallet = this.loadWallet();
    if (this.wallet !== undefined) {
      this.owners = this.loadOwnersOfWallet();
    }
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
    const owners: object = [
      { name: 'Owner 1',
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

  open(): any {
    const modalRef = this.modalService.open(EditOwnerComponent);
  }


}

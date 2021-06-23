import {MultisigWalletDataService, Wallet} from '../services/multisig-wallet-data.service';
import {AfterViewInit, Component, Input, OnInit, ViewChild, ElementRef} from '@angular/core';
import {AddOwnerComponent} from '../add-owner/add-owner.component';
import {AddTokenComponent} from '../add-token/add-token.component';

import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EditOwnerComponent} from '../edit-owner/edit-owner.component';
import {OwnerAddressService} from '../services/owner-address.service';
import {UserWalletDataService} from '../services/user-wallet-data.service';
import {RemoveTokenComponent} from '../remove-token/remove-token.component';

@Component({
  selector: 'app-wallet-details',
  templateUrl: './wallet-details.component.html',
  styleUrls: ['./wallet-details.component.css'],
  providers: [NgbActiveModal, NgbModal]
})
export class WalletDetailsComponent implements OnInit {

  constructor(public walletService: MultisigWalletDataService, private modalService: NgbModal,
              private ownerService: OwnerAddressService,
              public multisigService: MultisigWalletDataService,
              public dataService: UserWalletDataService) { }

  wallet: any;
  owners: any;
  private ownerAddress: any;
  message: any;



  ownersTableVisible = false;
  @ViewChild('toggleOwnersButton') toggleOwnersButton: ElementRef | undefined;

  /**
   * Toggles the Text of the owner button from Hide to Show and vice versa
   */
  toggleOwnersButtonText(): void {
    const button: HTMLElement | null = document.getElementById('toggleOwnersButton');
    if (button != null) {
      if (this.ownersTableVisible) {
        button.innerText = 'Show';
      } else {
        button.innerText = 'Hide';
      }
      this.ownersTableVisible = !this.ownersTableVisible;
    }


  }

  async ngOnInit(): Promise<void> {
    const wallet: Wallet = {
      name: '', address: '', balance: '', confirmations: '', owners: '', pending: '', network: ''
    };
    this.wallet =  wallet;
    this.wallet =  await this.loadWallet();
    if (this.wallet !== undefined) {
      this.owners = await this.loadOwnersOfWallet();

    } else {
      this.wallet =  wallet;
    }
    this.ownerService.currentAddress.subscribe(address => this.ownerAddress = address);
  }


  /**
   * Loads the Wallet that is referenced by the URL
   */
  async loadWallet(): Promise<Wallet> {
    const address: string = (location.href.split('/').pop() as string);
    let name = 'Unknown Wallet';
    if (localStorage.getItem('Wallets') !== null){
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



  openAddOwnerPopup(): any {
    const modalRef = this.modalService.open(AddOwnerComponent);
  }

  openAddTokenPopup(): any {
    const modalRef = this.modalService.open(AddTokenComponent);
  }

  openRemoveTokenPopup(): any {
    const modalRef = this.modalService.open(RemoveTokenComponent);
  }

  removeOwner(ownerAddress: any, contractAddress: any): any {
    this.walletService.removeOwner(ownerAddress, contractAddress);
  }

  /*--------------- Token auflisten und Token löschen ---------------- */
  toggleTokensButtonIcon(): void {
    const button: HTMLElement | null = document.getElementById('icon');
    if (button != null) {
      if (this.ownersTableVisible) {
        button.classList.remove('fas', 'fa-arrow-up');
        button.classList.add('fas', 'fa-arrow-down');
      } else {
        button.classList.remove('fas', 'fa-arrow-down');
        button.classList.add('fas', 'fa-arrow-up');
      }
      this.ownersTableVisible = !this.ownersTableVisible;
    }


  }

}

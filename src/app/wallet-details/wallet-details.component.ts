import {MultisigWalletDataService, Wallet} from '../services/multisig-wallet-data.service';
import {AfterViewInit, Component, Input, OnInit, ViewChild, ElementRef} from '@angular/core';
import {AddOwnerComponent} from '../add-owner/add-owner.component';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EditOwnerComponent} from '../edit-owner/edit-owner.component';
import {OwnerAddressService} from '../services/owner-address.service';
import {UserWalletDataService} from '../services/user-wallet-data.service';

// Test Interface;
// muss erweitert werden;
// falls Service für Transaktionen zuständig ist, sollte es in den Service verschoben werden.
export interface Transaction {
  id: number;
  destination: string;
  flag: 'none' | 'both' | '...';
}

@Component({
  selector: 'app-wallet-details',
  templateUrl: './wallet-details.component.html',
  styleUrls: ['./wallet-details.component.css']
})
export class WalletDetailsComponent implements OnInit {

  constructor(public walletService: MultisigWalletDataService, private modalService: NgbModal,
              private ownerService: OwnerAddressService,
              public multisigService: MultisigWalletDataService,
              public dataService: UserWalletDataService) { }

  // The wallet of the current details page:
  wallet: any;

  // Array of the corresponding owners:
  owners: any;

  // Array of the corresponding transactions:
  transactions: Transaction[] = [{id: 1, destination: '0x2C9C744CDE819753C26b0286248ea1eaFfb42ce8', flag: 'both'}];
  numberOfTransactions: any;
  pageSize = 10;
  currentPage: any;
  lastPage: any;

  private ownerAddress: any;
  message: any;

  // Variables for toggling the owner table
  ownersTableVisible = false;
  @ViewChild('toggleOwnersButton') toggleOwnersButton: ElementRef | undefined;

  // Variables for toggling the transactions table
  transactionsTableVisible = false;
  @ViewChild('toggleTransactionsButton') toggleTransactionsButton: ElementRef | undefined;

  /**
   * Toggles the text of the owner button from Hide to Show and vice versa
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

  /**
   * Toggles the text of the transaction button from Hide to Show and vice versa
   */
  toggleTransactionsButtonText(): void {
    const button: HTMLElement | null = document.getElementById('toggleTransactionsButton');
    if (button != null) {
      if (this.transactionsTableVisible) {
        button.innerText = 'Show';
      } else {
        button.innerText = 'Hide';
      }
      this.transactionsTableVisible = !this.transactionsTableVisible;
    }
  }

  /**
   * calls loadTransactions with the correct values and updates this.currentPage
   * @param page - the "page" that should be loaded. Number of entries in one page is specified in pageSize
   */
  loadPage(page: any): void {
    if (page > 0 && page <= this.lastPage) {
      this.currentPage = page;
      this.loadTransactions((page - 1) * this.pageSize, page * this.pageSize);
    }
  }

  loadTransactions(from: number, to: number): void {
    // TODO: Load the corrsponding transactions into ``transactions``
  }

  async ngOnInit(): Promise<void> {
    this.wallet =  await this.loadWallet();
    if (this.wallet !== undefined) {
      this.owners = await this.loadOwnersOfWallet();
      // TODO: Anzahl der Transaktionen des Multisigs laden:
      this.numberOfTransactions = 75;
      this.lastPage = Math.ceil(this.numberOfTransactions / this.pageSize);
      this.loadPage(1);
    }
    this.ownerService.currentAddress.subscribe(address => this.ownerAddress = address);
  }


  /**
   * Loads the Wallet that is referenced by the URL
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

  removeOwner(ownerAddress: any, contractAddress: any): any {
    this.walletService.removeOwner(ownerAddress, contractAddress);
  }

  getTransactions(): any {
    this.walletService.getTransactions('0x283011659f9Cd638b4d99EFB264b198917f6Ff5D');
  }


  confirmTransaction(contractAddress: any, transactionID: any): any {
    this.walletService.confirmTransaction(contractAddress, transactionID);
  }

  revokeTransaction(contractAddress: any, transactionID: any): any {
    this.walletService.revokeTransaction(contractAddress, transactionID);
  }

  openInsertAbiPopup(): any {
    // const modalRef = this.modalService.open(InsertAbiComponent);
  }
}

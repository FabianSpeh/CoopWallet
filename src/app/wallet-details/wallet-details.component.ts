import {MultisigWalletDataService, Wallet} from '../services/multisig-wallet-data.service';
import {AfterViewInit, Component, Input, OnInit, ViewChild, ElementRef} from '@angular/core';
import {AddOwnerComponent} from '../add-owner/add-owner.component';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EditOwnerComponent} from '../edit-owner/edit-owner.component';
import {OwnerAddressService} from '../services/owner-address.service';
import {UserWalletDataService} from '../services/user-wallet-data.service';

export interface Transaction {
  id: string;
  destination: string;
  value: string;
  data: string;
  insertAbiAction: string;
  ownersWhoConfirmed: string[];
  ownerAction: string;
  isExecuted: string;
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
  transactions: Transaction[] = [];
  numberOfTransactions: any;
  pageSize = 3;
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


  async loadNext(): Promise<void> {
    this.currentPage++;
    const page = this.currentPage;
    const startIndex = this.numberOfTransactions - (page - 1) * this.pageSize;
    let endIndex = this.numberOfTransactions - this.pageSize - (page - 1) * this.pageSize;

    if (endIndex < 0) {
      endIndex = 0;
    }
    await this.loadTransactions(endIndex, startIndex);
  }

  async loadTransactions(from: number, to: number): Promise<void> {
    const newTransactions = await this.walletService.getTransactions(this.wallet.address, from, to);
    for (let i = this.pageSize - 1; i >= 0; i--) {
      this.transactions.push(newTransactions[i]);
    }

  }

  async ngOnInit(): Promise<void> {
    this.wallet =  await this.loadWallet();
    if (this.wallet !== undefined) {
      this.owners = await this.loadOwnersOfWallet();
      this.numberOfTransactions = await this.walletService.getAllTransactionCount(this.wallet.address);
      this.currentPage = 0;
      await this.loadNext();
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

  getNameOfWallet(address: string): string {
    if (localStorage.getItem('Wallets') != null){
      const wallets = JSON.parse(localStorage.getItem('Wallets') || '{}');
      for (let i = 0; i < wallets.address.length; i++) {
        if (wallets.address[i] === address) {
          return wallets.name[i];
        }
      }
      return address.substring(0, 12) + '...';
    } else {
      return address.substring(0, 12) + '...';
    }
  }

  getDataSubject(data: string): string {
    var methodInformation = data.slice(2, 10);
    var transportInformation = data.slice(11);

    switch (methodInformation)
    {
      // Deals with the case, if the method is addOwner()
      case "7065cb48":
        var owner = '0x' + transportInformation;
        return "Method: addOwner()";

      // Deals with the case, if the method is removeOwner()
      case "173825d9":
        return "Method: removeOwner()";

      // Deals with the case, if the method is changeDailyLimit()
      case  "cea08621":
        return "Method: changeDailyLimit()";

      case "ba51a6df":
        return "Method: changeRequirement()";

      default:
        return data.substring(0, 12) + '...';
    }
  }

  getOwnerName(address: string): string {
    if (localStorage.getItem('Owners') != null) {
      const owners = JSON.parse(localStorage.getItem('Owners') || '{}');
      for (let i = 0; i < owners.address.length; i++) {
        if (owners.address[i] === address) {
          return owners.name[i];
        }
      }

      return address.substring(0, 12) + '...';

    } else {
      return address.substring(0, 12) + '...';
    }

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

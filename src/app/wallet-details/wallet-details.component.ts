import {MultisigWalletDataService, Wallet} from '../services/multisig-wallet-data.service';
import {AfterViewInit, Component, Input, OnInit, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import {AddOwnerComponent} from '../add-owner/add-owner.component';
import {AddTokenComponent} from '../add-token/add-token.component';

import {NgbActiveModal, ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EditOwnerComponent} from '../edit-owner/edit-owner.component';
import {OwnerAddressService} from '../services/owner-address.service';
import {UserWalletDataService} from '../services/user-wallet-data.service';
import {RemoveTokenComponent} from '../remove-token/remove-token.component';
import {TokensService} from '../services/tokens.service';
import {ClipboardService} from 'ngx-clipboard';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';
import {ContractAbiService} from '../services/contract-abi.service';
import {InsertAbiComponent} from '../insert-abi/insert-abi.component';
import {OwnerService} from '../services/owner.service';

export interface Transaction {
  id: string;
  destination: string;
  value: string;
  data: string;
  insertAbiAction: string;
  ownersWhoConfirmed: string[];
  ownerAction: string;
  isExecuted: boolean;
}

@Component({
  selector: 'app-wallet-details',
  templateUrl: './wallet-details.component.html',
  styleUrls: ['./wallet-details.component.css'],
  providers: [NgbActiveModal, NgbModal]
})
export class WalletDetailsComponent implements OnInit {

  constructor(public walletService: MultisigWalletDataService, private modalService: NgbModal,
              private ownerService: OwnerAddressService, private clipboardService: ClipboardService,
              public multisigService: MultisigWalletDataService, public dataService: UserWalletDataService,        public abiService: ContractAbiService,
public tokenService: TokensService, public change: ChangeDetectorRef, public  ownerArraySevice: OwnerService) { }



  // The wallet of the current details page:
  wallet: any;

  // Array of the corresponding owners:
  owners: any;

  // Array of the corresponding transactions:
  transactions: Transaction[] = [];
  numberOfTransactions: any;
  pageSize = 3;
  currentPage: any;

  private ownerAddress: any;
  message: any;
  tokens: any;
  closeResult = '';
  tokenAddress: any;
  token: any;
  nameToken = '';
  tokensDecimals = '';
  tokensSymbol = '';
  addressToken = '';
  walletAddress: any;


  // Variables for toggling the owner table
  ownersTableVisible = false;
  @ViewChild('toggleOwnersButton') toggleOwnersButton: ElementRef | undefined;

  // Variables for toggling the transactions table
  transactionsTableVisible = false;
  @ViewChild('toggleTransactionsButton') toggleTransactionsButton: ElementRef | undefined;


  /**
   * Copies the given address to the users clipboard
   * @param address - The address to be copied
   */
  copyToClipboard(address: string): void {
    this.clipboardService.copyFromContent(address);
  }


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
    if (startIndex > 0) {
      await this.loadTransactions(endIndex, startIndex);
    }
  }


  async loadTransactions(from: number, to: number): Promise<void> {
    const newTransactions = await this.walletService.getTransactions(this.wallet.address, from, to);
    for (let i = newTransactions.length - 1; i >= 0; i--) {
      this.transactions.push(newTransactions[i]);
    }
  }

  async ngOnInit(): Promise<void> {
    const wallet: Wallet = {
      name: '', address: '', balance: '', completebalance: '', confirmations: '', owners: '', pending: '', network: ''
    };
    this.wallet =  wallet;
    this.wallet =  await this.loadWallet();
    if (this.wallet !== undefined) {
      this.ownerArraySevice.owners = await this.loadOwnersOfWallet();

      this.numberOfTransactions = await this.walletService.getAllTransactionCount(this.wallet.address);
      this.currentPage = 0;
      await this.loadNext();
    } else {
      this.wallet =  wallet;
    }
    this.ownerService.currentAddress.subscribe(address => this.ownerAddress = address);
    await this.loadTokensFromLocalStorage();
    this.abiService.getMethodsFromABI('');
    console.log(this.abiService.getMethodNamesFromABI(''));
    this.abiService.getParametersFromMethod('', 'addOwner');
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

  getDataSubject(data: string, contractAddress: string): string {

    const methodName = this.abiService.getMethodNameFromData(data, contractAddress);

    return methodName;
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

  openAddTokenPopup(): any {
    const modalRef = this.modalService.open(AddTokenComponent);
  }

  openEditABIPopup(address: string): any {
    const modalRef = this.modalService.open(InsertAbiComponent);
    modalRef.componentInstance.address = address;
  }
  /*
  openRemoveTokenPopup(): any {
    const modalRef = this.modalService.open(RemoveTokenComponent);
  }
*/
  removeOwner(ownerAddress: any, contractAddress: any): any {
    this.walletService.removeOwner(ownerAddress, contractAddress);
  }

  /*--------------- Token auflisten und Token löschen ---------------- */
  /**
   * Toggles the font awesome of the token button from Hide to Show and vice versa
   */
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

  /**
   * download the tokens of a Wallet and store it in a variable
   */
  async loadTokensFromLocalStorage(): Promise<void> {
    const walletsAddress = this.tokenService.tokenWalletList;
    for (const walletAddres of walletsAddress) {
      if (walletAddres.walletAddress === this.wallet.address) {
        await this.tokenService.getTokensOfWallet(this.wallet.address).then((res) => this.tokens = res);
      }
    }
  }

  async openModal(content: any): Promise<void>{
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async fillTable(event: any, address: any): Promise<void>{

    this.token = event.valueOf();
    const wallAd = this.tokenService.tokenWalletList;
    for ( const elt of wallAd) {
      if ( elt.walletAddress === address){
        await this.tokenService.getTokensOfWallet(this.wallet.address).then((res) => {this.tokens = res; } );
        this.walletAddress = elt.walletAddress;
      }
    }
    for ( const elt of this.tokens){
      if ( elt.name === this.token){
        this.nameToken = elt.name;
        this.tokensDecimals = elt.decimals;
        this.tokensSymbol = elt.symbol;
        this.addressToken = elt.address;
        console.log(this.nameToken, this.tokensDecimals, this.tokensSymbol, this.addressToken);
      }
    }
    console.log(address);
    console.log(this.token);
  }

  async removeTokens(): Promise<void>{
    this.tokenService.removeTokenFromWallet(this.addressToken, this.walletAddress);
    for ( const token of this.tokens){
      if (token.address === this.addressToken){
        this.tokens.splice(token.index, 1);
      }
    }
    this.change.detectChanges();

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

  openAddTransactionPopup(): any {
    const modalRef = this.modalService.open(AddTransactionComponent);
  }

}

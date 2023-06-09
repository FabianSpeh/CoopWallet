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

import {AddTransactionComponent} from '../add-transaction/add-transaction.component';

import {ContractAbiService} from '../services/contract-abi.service';
import {InsertAbiComponent} from '../insert-abi/insert-abi.component';
import {OwnerService} from '../services/owner.service';
import Web3 from 'web3';

declare var window: any;
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
              public multisigService: MultisigWalletDataService, public dataService: UserWalletDataService,
              public abiService: ContractAbiService, public tokenService: TokensService, public change: ChangeDetectorRef,
              public  ownerArraySevice: OwnerService) { }



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
  web3: any;
  subscription: any;
  newTransaction = false;


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

  /**
   * calls this.loadTransactions() for the next n (n = this.pageSize) transactions
   */
  loadNext(): void {
    let to;
    if (this.transactions !== undefined && this.transactions.length > 0) {
      // @ts-ignore transaction cannot be undefined here
      to = Number(this.transactions[this.transactions.length - 1].id);
    } else {
      to = this.numberOfTransactions;
    }
    const from = Math.max(to - this.pageSize, 0);
    if (to > 0) {
      this.loadTransactions(from, to).then();
    }
  }

  /**
   * loads the transactions in given range into this.transactions
   * @param from - starting id
   * @param to - closing id (excluded)
   */
  async loadTransactions(from: number, to: number): Promise<void> {
    const newTransactions = await this.walletService.getTransactions(this.wallet.address, from, to);
    for (let i = newTransactions.length - 1; i >= 0; i--) {
      this.transactions.push(newTransactions[i]);
    }
  }

  /**
   * Subscribes to all Events on the current wallet address
   */
  subscribeToContractTransactions(): void {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      // Initialize the subscription:
      this.subscription = this.web3.eth.subscribe('logs', { address: this.wallet.address});
      // Define the function that should be called if data is received:
      this.subscription.on('data', async (log: any) => {
        // This part will likely be called multiple times, as new events might exist in multiple blocks;
        // thus you need check, if the received transaction was already added:
        const newNumberOfTransactions = await this.walletService.getAllTransactionCount(this.wallet.address);
        if (newNumberOfTransactions !== this.numberOfTransactions) {
          this.numberOfTransactions = newNumberOfTransactions;
          // get the latest transaction and add it to the front of the transactions-list
          const newTransaction =
            await this.walletService.getTransactions(this.wallet.address, this.numberOfTransactions - 1, this.numberOfTransactions);
          this.transactions.unshift(newTransaction.pop());
          // show text for 4 seconds, to inform user that new transaction was received:
          this.newTransaction = true;
          setTimeout(() => { this.newTransaction = false; }, 4000);
        } else {
          // Confirmation, Revoke or Duplicate:
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.transactions.length; i++) {
            const id = Number(this.transactions[i].id);
            const confirms = await this.walletService.getConfirmationsOfTransaction(this.wallet.address, id);
            // if the number of confirmation locally differs from the one in the contract, the transaction was revoked or confirmed and
            // should be replaced by the latest version:
            if (confirms !== this.transactions[i].ownersWhoConfirmed.length) {
              const transactions = await this.walletService.getTransactions(this.wallet.address, id, id + 1);
              const transaction = transactions.pop();
              this.transactions[i] = transaction;
            }
          }
        }
      });
      this.subscription.on('changed', (log: any) => {
        console.log('something changed', log);
      });
      console.log('subscribed to ', this.wallet.address);
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
      await this.loadNext();
    } else {
      this.wallet =  wallet;
    }
    this.ownerService.currentAddress.subscribe(address => this.ownerAddress = address);
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
    this.subscribeToContractTransactions();
    await this.loadTokensFromLocalStorage();
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

  /**
   * Opens a modal that lets you edit the (param) owner.
   */
  open(owner: any): any {
    const modalRef = this.modalService.open(EditOwnerComponent);
    this.ownerAddress = owner.address;
    this.ownerService.changeMessage(owner.address);
  }

  /**
   * Searches if the given Address is either a locally named wallet or owner and returns the name or the shortened address.
   */
  getNameOfAddress(address: string): string {
    let name = this.getNameOfWallet(address);
    if (name.startsWith('0x') && name.endsWith('...')) {
      name = this.getOwnerName(address);
    }
    return name;
  }

  /**
   * Searches the owners in local storage for the name of a given address and returns it. Returns the address shortened if no name was
   * found.
   */
  getNameOfWallet(address: string): string {
    if (localStorage.getItem('Wallets') != null){
      const wallets = JSON.parse(localStorage.getItem('Wallets') || '{}');
      for (let i = 0; i < wallets.address.length; i++) {
        if (wallets.address[i] === address) {
          return wallets.name[i];
        }
      }
      return address.substring(0, 8) + '...';
    } else {
      return address.substring(0, 8) + '...';
    }
  }

  getDataSubject(data: string, contractAddress: string): string {
    let methodName = this.abiService.getMethodNameFromData(data, contractAddress);
    if (methodName.length > 40) {
      methodName = methodName.slice(0, methodName.length / 2) + '\n' + methodName.slice(methodName.length / 2);
    }
    return methodName;
  }

  /**
   * Searches the wallets in local storage for the name of a given address and returns it. Returns the address shortened if no name was
   * found.
   */
  getOwnerName(address: string): string {
    if (localStorage.getItem('Owners') != null) {
      const owners = JSON.parse(localStorage.getItem('Owners') || '{}');
      for (let i = 0; i < owners.address.length; i++) {
        if (owners.address[i] === address) {
          return owners.name[i];
        }
      }

      return address.substring(0, 8) + '...';

    } else {
      return address.substring(0, 8) + '...';
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

  openRemoveTokenPopup(): any {
    const modalRef = this.modalService.open(RemoveTokenComponent);
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
      }
    }
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

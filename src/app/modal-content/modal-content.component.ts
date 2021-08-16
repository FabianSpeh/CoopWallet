import {Component, ViewChild} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Web3 from 'web3';
import {AddWalletSelectorComponent} from '../add-wallet-selector/add-wallet-selector.component';
import {WalletDataService} from '../services/wallet-data.service';
import {MultisigWalletDataService} from '../services/multisig-wallet-data.service';

declare var window: any;

@Component({
  selector: 'app-ngbd-modal-content',
  template: `

    <div class="modal-header">
      <h4 class="modal-title" id="modal-basic-title">Add a Wallet</h4>
    </div>
    <div class="modal-body">
      <form>
        <div class="form-group">
          <label for="nameOfWallet" id="label1" class="label">Name</label>
          <div class="input-group" id="nameInput">
            <input #walletName id="nameOfWallet" type="email" class="form-control" placeholder="Name of Wallet">
          </div>
          <label for="addressofWallet" class="label">Address</label>
          <div class="input-group">
            <input #walletAddress id="addressOfWallet" type="email" class="form-control" placeholder="Address of Wallet">

          </div>
        </div>
        <p #errorMessage hidden='true' style="color: red">You need to specify a <b>Name</b> and an <b>Address</b>!</p>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn btn-outline-light" (click)="save()" >Add</button>
      <button type="button" class="btn btn btn-outline-danger" (click)="this.activeModal.close()" >Close</button>
    </div>
  `,
  styleUrls: ['./modal-content.component.css']
})
/**
 * NgbdModalContentComponent contains the Popup for adding a new Wallet to your Account
 */
export class NgbdModalContentComponent {
  @ViewChild('walletName') walletNameElement: any;
  @ViewChild('walletAddress') walletAddressElement: any;
  @ViewChild('errorMessage') errorMessage: any;

  walletName: any;
  walletAddress: any;
  walletList: any;
  web3js: any;

  contractAbi: any;

  constructor(public activeModal: NgbActiveModal, public walletData: WalletDataService, public walletService: MultisigWalletDataService) {
    this.contractAbi = '[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"owners","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"removeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"revokeConfirmation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"address"}],"name":"confirmations","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"calcMaxWithdraw","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"pending","type":"bool"},{"name":"executed","type":"bool"}],"name":"getTransactionCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"dailyLimit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastDay","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"addOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"isConfirmed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"getConfirmationCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"transactions","outputs":[{"name":"destination","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"},{"name":"executed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwners","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"from","type":"uint256"},{"name":"to","type":"uint256"},{"name":"pending","type":"bool"},{"name":"executed","type":"bool"}],"name":"getTransactionIds","outputs":[{"name":"_transactionIds","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"getConfirmations","outputs":[{"name":"_confirmations","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transactionCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_required","type":"uint256"}],"name":"changeRequirement","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"confirmTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"destination","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"}],"name":"submitTransaction","outputs":[{"name":"transactionId","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_dailyLimit","type":"uint256"}],"name":"changeDailyLimit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MAX_OWNER_COUNT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"required","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"newOwner","type":"address"}],"name":"replaceOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"executeTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"spentToday","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_owners","type":"address[]"},{"name":"_required","type":"uint256"},{"name":"_dailyLimit","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"dailyLimit","type":"uint256"}],"name":"DailyLimitChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Confirmation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Revocation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Submission","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Execution","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"ExecutionFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"OwnerAddition","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"OwnerRemoval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"required","type":"uint256"}],"name":"RequirementChange","type":"event"}]';

    this.walletList = {
      name: [],
      address: []
    };

  }
  /**
   * triggers when hitting the Add Button in the "Add Wallet" Popup
   */
  save(): any {

    if (this.walletNameElement.nativeElement.value === '' || this.walletAddressElement.nativeElement.value === ''){
    this.errorMessage.nativeElement.hidden = false;
    }
    else{
      this.addCookies();
      this.activeModal.close();
      this.activeModal.close();
    }
  }
  /**
   * parses the current Local Storage entry with the key "Wallets" and pushes a newly added Wallet onto it
   */
  async addCookies(): Promise<any> {
    // checks if Wallets Cookie already exists and retrieves it
    if (localStorage.getItem('Wallets') != null) {
      // this.walletList = JSON.parse(this.cookieService.get('Wallets'));
      this.walletList = JSON.parse(localStorage.getItem('Wallets') || '{}');
    }
    // takes wallet Name and wallet Address from Text Inputs
    this.walletName = this.walletNameElement.nativeElement.value;
    this.walletAddress = this.walletAddressElement.nativeElement.value;

    // adds new Wallet name/ Address to Array
    this.walletList.name.push(this.walletName);
    this.walletList.address.push(this.walletAddress);
    let isAdress = false;
    try {
      if (window.ethereum) {
        this.web3js = new Web3(window.ethereum);
        let ownerListNumber = 0;
        await this.web3js.eth.getBalance(this.walletAddress);
        const MultiSigContract = await new this.web3js.eth.Contract(JSON.parse(this.contractAbi), this.walletAddress);
        await MultiSigContract.methods.getOwners().call().then((res: any) => ownerListNumber = res.length);
        if (ownerListNumber <= 0){
          isAdress = false;
        } else {
          isAdress = true;
        }
      }
    } catch (e) {
      isAdress = false;
      console.log('Wrong Adress');
      console.log(this.walletAddress);
    }
    // adds new Array to Cookies as Json
    if (isAdress) {
      this.walletService.getWalletJSON(this.walletName, this.walletAddress).then((res) => { this.walletData.addData(res); });
      localStorage.setItem('Wallets', JSON.stringify(this.walletList));
    // debugging
    /**  for (let i = 0; i < this.walletList.name.length; i++) {
     *
     *   console.log('Name: ' + this.walletList.name[i] + ' Address: ' + this.walletList.address[i]);
     *
     * }
     */
  }
  }
}


@Component({
  selector: 'app-modal-content-component',
  templateUrl: './modal-content.component.html'
})
export class ModalContentComponent {
  @ViewChild('walletName') walletName: any;
  constructor(private modalService: NgbModal) {}

  open(): any {
    const modalRef = this.modalService.open(NgbdModalContentComponent);
  }
  openAddWallet(): any {
    const modalRef = this.modalService.open(AddWalletSelectorComponent);
  }
}

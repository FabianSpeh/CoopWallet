import {Component, OnInit, ViewChild} from '@angular/core';

import {MultisigWalletDataService} from '../services/multisig-wallet-data.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MultisigCreateService} from '../services/multisig-create.service';
import Web3 from 'web3';
import {WalletDataService} from '../services/wallet-data.service';

declare var window: any;

@Component({
  selector: 'app-create-wallet',
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.css'],
  providers: [NgbActiveModal]
})
export class CreateWalletComponent implements OnInit {
  @ViewChild('nameofWallet') nameOfWalletElement: any;
  @ViewChild('requiredConfirmations') requiredConfirmationsElement: any;
  @ViewChild('dailyLimit') dailyLimitElement: any;

  @ViewChild('nameOfOwner') nameOfOwner: any;
  @ViewChild('addressOfOwner') addressOfOwner: any;
  owners: any;
  walletList: any;
  ownerList: any;

  constructor(public activeModal: NgbActiveModal, public createMultisSig: MultisigCreateService,
              public walletData: WalletDataService, public walletService: MultisigWalletDataService, public modalService: NgbModal) {
    this.walletList = {
      name: [],
      address: []
    };
    this.ownerList = {
      name: [],
      address: []
    };
  }

   async loadDefaultOwner(): Promise<object>{
    const ownersTemp: object[] = [];
    let accounts: any;
    if (window.ethereum) {
       await window.ethereum.request({method: 'eth_requestAccounts'});
       const web3js = new Web3(window.ethereum);
       accounts = await web3js.eth.getAccounts();
     }
    const myAccount = accounts[0];

    ownersTemp[0] = {name: 'My Account', address: myAccount};

    console.log(ownersTemp);
    return ownersTemp;
  }

  async ngOnInit(): Promise<void> {

  this.owners = await this.loadDefaultOwner();

  }

  addOwner(): any {

    this.owners[this.owners.length] = {name: this.nameOfOwner.nativeElement.value, address: this.addressOfOwner.nativeElement.value};
    this.nameOfOwner.nativeElement.value = '';
    this.addressOfOwner.nativeElement.value = '';


  }

  removeOwner(owner: any): void{
for (let i  = 0; i <= this.owners.length; i++){
  if (this.owners[i].address === owner.address){

    this.owners.splice(i, 1);
  }
}
  }

  async createWallet(): Promise<any> {
    const nameOfWallet = this.nameOfWalletElement.nativeElement.value;
    const requiredConfirmations = this.requiredConfirmationsElement.nativeElement.value;
    const dailyLimit = this.dailyLimitElement.nativeElement.value;
    const ownersArray: string[] = [];
    for (const owner of this.owners) {
      ownersArray.push(owner.address.toString());
    }
    if (requiredConfirmations <= this.owners.length) {
      const walletAddress = await this.createMultisSig.deployMultisig(ownersArray, requiredConfirmations, dailyLimit);
      console.log(walletAddress);
      this.editJsons(nameOfWallet, walletAddress);
      this.modalService.dismissAll();
    } else {
      // throw Error
    }


  }

  /**
   * Load the Json from Local Storage and Save new Wallet into it
   * @param walletName Name of the Wallet
   * @param walletAddress Address of the Wallet
   */
  editJsons(walletName: string, walletAddress: string): void{
    // checks if Wallets Cookie already exists and retrieves it
    if (localStorage.getItem('Wallets') != null) {
      // this.walletList = JSON.parse(this.cookieService.get('Wallets'));
      this.walletList = JSON.parse(localStorage.getItem('Wallets') || '{}');
    }

    // adds new Wallet name/ Address to Array
    this.walletList.name.push(walletName);
    this.walletList.address.push(walletAddress);
    this.walletService.getWalletJSON(walletName, walletAddress).then((res) => { this.walletData.addData(res); });

    localStorage.setItem('Wallets', JSON.stringify(this.walletList));

    // Load Owners of Wallet
    if (localStorage.getItem('Owners') != null) {
      this.ownerList = JSON.parse(localStorage.getItem('Owners') || '{}');
    }
    for (const owner of this.owners) {
      const ownerName = owner.name;
      const ownerAddress = owner.address;
      if (ownerName === 'My Account'){
        continue;
      }
      let addressExist = false;
      for (let i = 0; i <= this.ownerList.address.length; i++) {
        if (ownerAddress === this.ownerList.address[i]) {

          this.ownerList.name[i] = ownerName;
          addressExist = true;
        }
      }

      if (!addressExist){
        this.ownerList.name.push(ownerName);
        this.ownerList.address.push(ownerAddress);
      }
    }
    localStorage.setItem('Owners', JSON.stringify(this.ownerList));
  }
}

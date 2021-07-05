import {Component, OnInit, ViewChild} from '@angular/core';

import {MultisigWalletDataService} from '../services/multisig-wallet-data.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {MultisigCreateService} from '../services/multisig-create.service';
@Component({
  selector: 'app-create-wallet',
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.css']
})
export class CreateWalletComponent implements OnInit {
  @ViewChild('nameofWallet') nameOfWalletElement: any;
  @ViewChild('requiredConfirmations') requiredConfirmationsElement: any;
  @ViewChild('dailyLimit') dailyLimitElement: any;

  @ViewChild('nameOfOwner') nameOfOwner: any;
  @ViewChild('addressOfOwner') addressOfOwner: any;
owners: any;


  constructor(public multiSigService: MultisigWalletDataService, public activeModal: NgbActiveModal, public createMultisSig: MultisigCreateService) { }

   async loadDefaultOwner(): Promise<object>{
    const ownersTemp: object[] = [];
    const accounts = await this.multiSigService.web3js.eth.getAccounts();
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

  createWallet(): any {
    const nameOfWallet = this.nameOfWalletElement.nativeElement.value;
    const requiredConfirmations = this.requiredConfirmationsElement.nativeElement.value;
    const dailyLimit = this.dailyLimitElement.nativeElement.value;
    const  ownersArray = [];
    for ( const owner of this.owners){
      ownersArray.push(owner.address);
    }
    console.log(this.owners.length + 'Dad' + requiredConfirmations);
    if (requiredConfirmations <= this.owners.length){
     // TODO: Creation of Wallet
      this.createMultisSig.deployMultisig(ownersArray, requiredConfirmations, dailyLimit);
   }

   else {
     // throw Error
   }


  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {ContractAbiService} from '../services/contract-abi.service';
import Web3 from 'web3';

declare var window: any;

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css'],
  providers: [NgbActiveModal]
})
export class AddTransactionComponent implements OnInit {
  @ViewChild('ABIString') ABIstring: any;
  @ViewChild('selectedMeth') selectMeth: any;
  @ViewChild('Ethereum') ethereumInput: any;
  @ViewChild('Destination') destinationInput: any;
  disableElement = true;
  method: any;
  selectMethod: HTMLElement | null | undefined;
  web3: any;
  multisigABI = '[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"owners","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"removeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"revokeConfirmation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"address"}],"name":"confirmations","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"calcMaxWithdraw","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"pending","type":"bool"},{"name":"executed","type":"bool"}],"name":"getTransactionCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"dailyLimit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastDay","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"addOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"isConfirmed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"getConfirmationCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"transactions","outputs":[{"name":"destination","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"},{"name":"executed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwners","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"from","type":"uint256"},{"name":"to","type":"uint256"},{"name":"pending","type":"bool"},{"name":"executed","type":"bool"}],"name":"getTransactionIds","outputs":[{"name":"_transactionIds","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"getConfirmations","outputs":[{"name":"_confirmations","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transactionCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_required","type":"uint256"}],"name":"changeRequirement","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"confirmTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"destination","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"}],"name":"submitTransaction","outputs":[{"name":"transactionId","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_dailyLimit","type":"uint256"}],"name":"changeDailyLimit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MAX_OWNER_COUNT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"required","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"newOwner","type":"address"}],"name":"replaceOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"executeTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"spentToday","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_owners","type":"address[]"},{"name":"_required","type":"uint256"},{"name":"_dailyLimit","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"dailyLimit","type":"uint256"}],"name":"DailyLimitChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Confirmation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Revocation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Submission","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Execution","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"ExecutionFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"OwnerAddition","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"OwnerRemoval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"required","type":"uint256"}],"name":"RequirementChange","type":"event"}]';

  constructor(public activeModal: NgbActiveModal, public abiService: ContractAbiService) { }

  ngOnInit(): void {
  }

  async sendTransaction(): Promise<void> {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      window.ethereum.request({method: 'eth_requestAccounts'});
      const accounts = await this.web3.eth.getAccounts();
      const currentAccountAddress = accounts[0];
      const ethereumAmount = this.ethereumInput.nativeElement.value;

      const methodName = this.selectMeth.nativeElement.value;
      const destinationABI = this.ABIstring.nativeElement.value;
      const destinationAddress = this.destinationInput.nativeElement.value;
      const multisigAddress = location.href.split('/').pop();
      const multisigContract = await new this.web3.eth.Contract(JSON.parse(this.multisigABI), multisigAddress);

      let data: any;
      if (!destinationABI) {
        data = [];
      } else {
        const parameters = [];
        const parametersOfMethod = await this.abiService.getParametersFromMethod(destinationABI, methodName);
        const methodNumber = parametersOfMethod.length;
        const functionObject = {
          name: methodName,
          type: 'function',
          inputs: parametersOfMethod
        };
        for (let i = 0; i < methodNumber; i++) {
          const inputElement = (document.getElementById(String(i)) as HTMLInputElement);
          parameters.push(inputElement.value);
        }
        data = this.web3.eth.abi.encodeFunctionCall(functionObject, parameters);
      }
      await multisigContract.methods
        .submitTransaction(destinationAddress, this.web3.utils.toWei(ethereumAmount, 'ether'), data)
        .send({from: currentAccountAddress}).then((res: any) => console.log(res));
    }
  }

  /**
   * Methode to get methods list and alsa unlock the input for selecting a methode
   */
  getMethod(): void{
    if (this.ABIstring.nativeElement.value !== ''){
      this.method =  this.abiService.getMethodNamesFromABI(this.ABIstring.nativeElement.value);
      if (this.method !== ''){
        this.selectMethod = document.getElementById('possibleMethodes');
        if (this.selectMethod !== null) {
          this.selectMethod.classList.remove('blocked');
        }
        this.disableElement = false;
      }
    }else {
      this.disableElement = true;
      this.method = '';
      if (this.selectMethod !== undefined && this.selectMethod !== null) {
        this.selectMethod.classList.add('blocked');
      }
    }
  }

  /**
   * Method to get the selected Method
   */
  getSelectedMethod( ): void {
    console.log( this.selectMeth.nativeElement.value );
    const method = this.abiService.getParametersFromMethod(this.ABIstring.nativeElement.value, this.selectMeth.nativeElement.value);
    this.createInputField(method);
  }

  /**
   * methode to create the needed InputFields
   * @param needed Parameter Object
   */
  createInputField(needed: []): void {
    this.removeAdded();
    if (needed !== null && needed.length >= 0){
      let container: HTMLElement;
      container = document.createElement('div');
      container.classList.add('mt-3');
      container.classList.add('mb-1');
      container.classList.add('form-group');
      container.setAttribute('id', 'added');
      const parent = document.getElementById('lastElement');

      const message = document.createElement('div');
      message.innerHTML = '<h4>Paramters</h4><br>';

      if (container !== null){
        container.appendChild(message);
      }
      let idCounter = 0;
      for (const inputField of needed){
        const name = this.getName(inputField);
        const lab = document.createElement('label');
        if ( name !== null){
          lab.classList.add('label');
          lab.setAttribute('for', 'name');
          lab.innerHTML = '<h5> ' + name + ' </h5>';
          const inputF = document.createElement('input');
          inputF.classList.add('form-control');
          inputF.classList.add('inputDesign');
          inputF.setAttribute('id', String(idCounter++));
          inputF.setAttribute('type', this.getType(inputField));
          if (container !== null) {
            container.appendChild(lab);
            container.appendChild(inputF);
          }
        }
      }

      if (parent !== null){
        parent.appendChild(container);
      }
    }
  }

  /**
   * methode to get the name of the InputField
   * @param obj methode object
   */
  getName(obj: {name: string, type: string}): string {
    return obj.name;
  }

  /**
   * methode to get the Type of the input
   * @param obj methode object
   */
  getType(obj: {name: string, type: string}): string {
    return obj.type;
  }

  /**
   * methode to clean the added div
   */
  removeAdded(): void{
    const toRemove = document.getElementById('added');
    if (toRemove !== null){
      toRemove.remove();
    }

  }
}

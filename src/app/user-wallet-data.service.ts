import { Injectable } from '@angular/core';
import Web3 from 'web3';

declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class UserWalletDataService {

  balance: number;
  accounts: any;
  web3js: any;
  network: any;
  providerOnline: boolean;
  selectedAccount: string;
  selectedAccountShorten: string;
  chainId: any;
  nonce: number;
  accountIndex = 0;
  dataGot: boolean;

  constructor() {
    this.balance = 0;
    this.dataGot = false;
    this.selectedAccount = '';
    this.selectedAccountShorten = '';
    this.nonce = 0;
    this.providerOnline = false;
  }

  public async getData(accountIndex: number): Promise<boolean>{
    this.accountIndex = accountIndex;
    if (window.ethereum) {
      await window.ethereum.enable();
      this.web3js = new Web3(window.ethereum);
      try {
        this.providerOnline = await this.web3js.eth.net.isListening();
      } catch (e) {
        console.log(e);
      }
      this.accounts = await this.web3js.eth.getAccounts();
      this.balance = await this.web3js.eth.getBalance(this.accounts[this.accountIndex]);
      this.chainId = await this.web3js.eth.getChainId();
      this.selectedAccount = this.accounts[this.accountIndex];
      this.web3js.defaultAccount = this.selectedAccount;
      this.selectedAccountShorten = this.selectedAccount.substring(0, 17) + '....';
      this.nonce = await this.web3js.eth.getTransactionCount(this.selectedAccount);

      const test = this.balance / 1000000000000000000;
      this.balance = test;
      this.dataGot = true;
      return this.dataGot;
    }
    this.dataGot = false;
    return this.dataGot;
  }
}

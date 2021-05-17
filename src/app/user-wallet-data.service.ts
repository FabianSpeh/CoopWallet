import { Injectable } from '@angular/core';
import Web3 from 'web3';

declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class UserWalletDataService {
  /**
   * Service to get all User Wallet Data
   * @param balance - Current User Wallet Balance
   * @param accounts - Array of all User Wallet Accounts
   * @param web3js - Web3
   * @param network - Current User Wallet Network
   * @param providerOnline - boolean which saves the status of the provider
   * @param chainId - Current Chain Id of the User Wallet
   * @param nonce - Current Nonce of the User Wallet
   * @param accountIndex - Current index of the Selected account on the Site of the accounts array.
   * @param dataGot - Save if the Data has been extracted from the User Wallet
   */
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

  /**
   * Set up all initial data to be empty or 0
   */
  constructor() {
    this.balance = 0;
    this.dataGot = false;
    this.selectedAccount = '';
    this.selectedAccountShorten = '';
    this.nonce = 0;
    this.providerOnline = false;
  }

  /**
   * Extract all relevant data from the User Wallet
   * @param accountIndex - Index of the Select Account, of the on Site select User Wallet
   */
  public async getData(accountIndex: number): Promise<boolean>{
    this.accountIndex = accountIndex;
    if (window.ethereum) {
      await window.ethereum.send('eth_requestAccounts');
      this.web3js = new Web3(window.ethereum);
      try {
        this.providerOnline = await this.web3js.eth.net.isListening();
      } catch (e) {
        console.log(e);
      }
      this.accounts = await this.web3js.eth.getAccounts();
      this.balance = await this.web3js.eth.getBalance(this.accounts[this.accountIndex]) / 1000000000000000000;
      this.chainId = await this.web3js.eth.getChainId();
      this.selectedAccount = this.accounts[this.accountIndex];
      this.web3js.defaultAccount = this.selectedAccount;
      this.selectedAccountShorten = this.selectedAccount.substring(0, 17) + '....';
      this.nonce = await this.web3js.eth.getTransactionCount(this.selectedAccount);
      this.dataGot = true;
      return this.dataGot;
    }
    this.dataGot = false;
    return this.dataGot;
  }
}

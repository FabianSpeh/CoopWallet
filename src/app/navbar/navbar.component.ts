import { Component, OnInit } from '@angular/core';
import Web3 from 'web3';
import {BrowserRefreshService} from '../browser-refresh.service';

declare var window: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  balance: number;
  accounts: any;
  web3js: any;
  network: any;
  selectedAccount: string;
  selectedAccountShorten: string;
  chainId: any;
  accountIndex = 0;
  etherumEnabled: boolean;
  dataGet: boolean;
  ethEnabled = async () => {

    if (window.ethereum) {
      await window.ethereum.enable();
      this.web3js = new Web3(window.ethereum);
      this.accounts = await this.web3js.eth.getAccounts();
      this.balance = await this.web3js.eth.getBalance(this.accounts[this.accountIndex]);
      this.network = await this.web3js.eth.net.getNetworkType();
      this.chainId = await this.web3js.eth.getChainId();
      this.selectedAccount = this.accounts[this.accountIndex];
      this.web3js.defaultAccount = this.selectedAccount;
      this.selectedAccountShorten = this.selectedAccount.substring(0, 17) + '....';
      console.log(this.network);
      console.log(this.chainId);
      console.log(this.accounts);
      const test = this.balance / 1000000000000000000;
      this.balance = test;
      return true;
    }
    return false;
  }
  constructor(private service: BrowserRefreshService) {
    this.balance = 0;
    this.etherumEnabled = false;
    this.dataGet = false;
    this.selectedAccount = '';
    this.selectedAccountShorten = '';
  }

  // tslint:disable-next-line:typedef
  async checkData(){
    this.etherumEnabled = await this.service.checkEtherumConection();
    this.network = this.service.network;
  }

  async ngOnInit(): Promise<void> {
    await this.checkData();
    if (this.etherumEnabled){
      await this.connectMetaMask();
    }

    // TODO Get MetaMaskData if this.etherumEnabled is true and Change Navbar Layout to show these Stats
  }

  async connectMetaMask(): Promise<void> {
    this.dataGet = await this.ethEnabled();
    if (this.dataGet) {
      console.log('Connect to Metamask');
    }
  }

  async accountSwitch(index: number): Promise<void> {
    this.accountIndex = index;
    this.dataGet = await this.ethEnabled();
    if (this.dataGet) {
      console.log('Connect to Metamask');
    }
  }

}

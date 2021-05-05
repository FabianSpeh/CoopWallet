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
  etherumEnabled: boolean;
  ethEnabled = async () => {

    if (window.ethereum) {
      await window.ethereum.enable();
      this.web3js = new Web3(window.ethereum);
      this.accounts = await this.web3js.eth.getAccounts();
      this.balance = await this.web3js.eth.getBalance(this.accounts[0]);
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
  }

  async checkData(){
    this.etherumEnabled = await this.service.checkEtherumConection();
  }

  async ngOnInit(): Promise<void> {
    await this.checkData();
    console.log(this.etherumEnabled);
  }

  getMetaMask(): void{
    if (this.ethEnabled()){
      console.log('Connect to Metamask');
    }
  }

}

import { Component, OnInit } from '@angular/core';
import Web3 from 'web3';
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
  ethEnabled = async () => {

    if (window.ethereum) {
      await window.ethereum.send('eth_requestAccounts');
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
  constructor() {this.balance = 0; }

  ngOnInit(): void {
  }

  getMetaMask(): void{
    if (this.ethEnabled()){
      console.log('Connect to Metamask');
    }
  }

}

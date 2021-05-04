import { Component, OnInit } from '@angular/core';
import Web3 from 'web3';
declare var window: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private web3: any;
  ethEnabled = async () => {
    if (window.ethereum) {
      await window.ethereum.send('eth_requestAccounts');
      window.web3 = new Web3(window.ethereum);
      return true;
    }
    return false;
  }
  constructor() { }

  ngOnInit(): void {
  }

  getMetaMask(): void{
    if (this.ethEnabled()){
      console.log('Test');
    }
  }

}

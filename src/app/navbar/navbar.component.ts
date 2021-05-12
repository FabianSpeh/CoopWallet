import { Component, OnInit } from '@angular/core';
import Web3 from 'web3';
import {BrowserRefreshService} from '../browser-refresh.service';
import {UserWalletDataService} from '../user-wallet-data.service';

declare var window: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  web3js: any;
  network: any;
  accountIndex = 0;
  etherumEnabled: boolean;
  dataGot: boolean;

  constructor(private service: BrowserRefreshService, public userService: UserWalletDataService) {
    this.etherumEnabled = false;
    this.dataGot = false;
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
  }

  async connectMetaMask(): Promise<void> {
    this.dataGot = await this.userService.getData(this.accountIndex);
    if (this.dataGot) {
      console.log('Connect to Metamask');
    }
  }

  async accountSwitch(index: number): Promise<void> {
    this.accountIndex = index;
    this.dataGot = await this.userService.getData(this.accountIndex);
    if (this.dataGot) {
      console.log('Connect to Metamask');
    }
  }

}

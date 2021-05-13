import { Component, OnInit, OnDestroy } from '@angular/core';
import {BrowserRefreshService} from '../browser-refresh.service';
import {UserWalletDataService} from '../user-wallet-data.service';
import Web3 from 'web3';

declare var window: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  network: any;
  accountIndex = 0;
  etherumEnabled: boolean;
  dataGot: boolean;
  interval: any;
  updateTime = 600000;
  web3js: any;

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
    this.interval = setInterval(() => this.update(), this.updateTime);
    if (window.ethereum) {
      this.web3js = new Web3(window.ethereum);
      // tslint:disable-next-line:only-arrow-functions typedef
      this.web3js.eth.subscribe('newBlockHeaders', (error: any, result: any) => {
        if (!error) {
          this.update();
          return;
        }

        console.error(error);
      });
    }
  }

 async update(): Promise<void>{
    console.log('Update Started');
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

  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.web3js.eth.clearSubscriptions();
  }

}

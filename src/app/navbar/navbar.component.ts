import {Component, OnInit, OnDestroy, ChangeDetectorRef, NgModule} from '@angular/core';
import {BrowserRefreshService} from '../services/browser-refresh.service';
import {UserWalletDataService} from '../services/user-wallet-data.service';
import Web3 from 'web3';
import {ClipboardService} from 'ngx-clipboard';

declare var window: any;


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  /**
   * Class provides methods which are used as a help for the creation of the navbar.
   *
   * @param network - saves the current networkname.
   * @param accountIndex - has the current selected account as an index of a account array
   * @param ethereumEnabled - saves if a window.ethereum Provider is installed in the browser
   * @param dataGot - is true if the window.ethereum Provider answered.
   * @param interval - used to setup an Interval which calls the update Method after updateTime time
   * @param updateTime - time how often the update Method should be called
   * @param web3js - web3
   */
  network: any;
  accountIndex = 0;
  ethereumEnabled: boolean;
  dataGot: boolean;
  interval: any;
  updateTime = 10000;
  web3js: any;

  /**
   * Constructor to set up the services and give ethereumEnabled and data got initial false values
   * @param service - Service which called after a browser refresh and check if there is already a Connection to a provider established
   * @param userService - Service which provides all relevant Data from the User Wallet.
   * @param change - Dection of Change
   * @param clipboardService - Service used to save an address to the clipboard if clicked
   */
  constructor(private service: BrowserRefreshService, public userService: UserWalletDataService, public change: ChangeDetectorRef,
              private clipboardService: ClipboardService) {
    this.ethereumEnabled = false;
    this.dataGot = false;
  }


  /**
   * Copies the given address to the users clipboard
   * @param address - The address to be copied
   */
  copyToClipboard(address: string): void {
    this.clipboardService.copyFromContent(address);
  }


  /**
   * Calls BrowserRefreshService to check if there is already a Connected provider to the Site
   */
  async checkData(): Promise<void>{
    this.ethereumEnabled = await this.service.checkEthereumConnection();
    this.network = this.service.network;
  }

  /**
   * First check if there already a connection and if there is gets the Data from the User Wallet, then set up various Methods to refresh
   * User Data
   */
  async ngOnInit(): Promise<void> {
    await this.checkData();
    if (this.ethereumEnabled){
      await this.connectMetaMask();
    }
    /** Set up Interval to call the Update Method every updateTime time */
    this.interval = setInterval(() => this.update(), this.updateTime);
    if (window.ethereum) {
      this.web3js = new Web3(window.ethereum);

      /** Setting up of Various Event Listener to act on User Wallet Data Changes */
      window.ethereum.on('accountsChanged', () => {
        this.accountIndex = 0;
        this.update();
      });

      window.ethereum.on('networkChanged', () => {
        this.update();
        window.location.reload();
      });

      window.ethereum.on('balanceChanged', () => {
        this.update();
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }

  /**
   * Update Method to Update all the Data from the User Wallet
   */
 async update(): Promise<void>{
    await this.checkData();
    if (this.ethereumEnabled){
      await this.connectMetaMask();
    }
  }


  /**
   * Calls the User-Wallet-Data Service to get all the Data from the User Wallet
   */
  async connectMetaMask(): Promise<void> {
    this.dataGot = await this.userService.getData(this.accountIndex);
    if (this.dataGot) {
      window.location.reload();
    }
  }


  /**
   * Help Method for Account Switching on the Site
   * @param index - Index of the Account to which the User switches on the Site
   */
  async accountSwitch(index: number): Promise<void> {
    this.accountIndex = index;
    this.dataGot = await this.userService.getData(this.accountIndex);
    if (this.dataGot) {
      this.change.detectChanges();
    }
  }

  /**
   * Cleanup of the Interval and subscriptions.
   */
  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

}

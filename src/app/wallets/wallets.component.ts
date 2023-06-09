import {ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {ClipboardService} from 'ngx-clipboard';
import {MultisigWalletDataService} from '../services/multisig-wallet-data.service';
import {UserWalletDataService} from '../services/user-wallet-data.service';
import {BrowserRefreshService} from '../services/browser-refresh.service';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {WalletDataService} from '../services/wallet-data.service';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css']
})
export class WalletsComponent implements OnInit, OnDestroy {

  interval: any;
  interval2: any;
  updateTime = 100;
  updateTime2 = 10000;

  constructor(private modalService: NgbModal, public change: ChangeDetectorRef, private clipboardService: ClipboardService,
              public walletService: MultisigWalletDataService, public userService: UserWalletDataService,
              public refreshservice: BrowserRefreshService, public walletData: WalletDataService) {}
  @ViewChild('walletName') walletNameElement: any;
  @ViewChild('walletAddress') walletAddressElement: any;
  @ViewChild('errorMessage') errorMessage: any;
  closeResult = '';
  walletsname = '';
  editwalletname = '';
  walletsaddress = '';
  ethereumEnabled = false;

  // WalletsData contains the Wallets from local storage
  // Currently also holds dummy-data
  //  walletsData: any[] = [];
  // tslint:disable-next-line:typedef
  name: any;

  convertBalanceString(balance: string): string {
    return  balance; }



  /**
   * Calls BrowserRefreshService to check if there is already a Connected provider to the Site
   */
  async checkData(): Promise<void>{
    this.ethereumEnabled = await this.refreshservice.checkEthereumConnection();
  }

  /**
   * Formats the given address for better readability
   * @param address - The address to be formatted
   */
  formatAddressString(address: string): string {
    return (address.length > 16 ? address.substring(0, 14) : address) + '..';
  }

  /**
   * Copies the given address to the users clipboard
   * @param address - The address to be copied
   */
  copyToClipboard(address: string): void {
    this.clipboardService.copyFromContent(address);
  }

  /**
   * Loads stored Wallets into WalletsData
   */
  public async readCookies(): Promise<void> {
    if (localStorage.getItem('Wallets') == null || !this.ethereumEnabled){
      return;
    }
    const wallets = JSON.parse(localStorage.getItem('Wallets') || '{}');
    this.walletData.walletsData = [];
    for (let i = 0; i < wallets.name.length; i++) {
      this.walletService.getWalletJSON(wallets.name[i], wallets.address[i]).then((res) => { this.walletData.addData(res);
                                                                                             });
    }
    this.change.detectChanges();
  }

  async ngOnInit(): Promise<void> {
    await this.checkData();
    await this.readCookies();
    this.interval = setInterval(() => this.update(), this.updateTime);
    this.interval2 = setInterval(() => this.update2(), this.updateTime2);
  }

  /**
   * Check if User is logged in an then get Data from Cookies and Multisig
   */
  async update(): Promise<void>{
    await this.checkData();
    if (this.ethereumEnabled){
      if (this.walletData.walletsData.length === 0 && localStorage.getItem('Wallets') !== null) {
        await this.readCookies();
      }
    }
  }

  /**
   * Update Method to Update all the Data from the MultisigWallets
   */
  async update2(): Promise<void>{
    await this.checkData();
    if (this.ethereumEnabled){
      if (this.walletData.walletsData.length !== 0) {
        for (const wallet of this.walletData.walletsData) {
          await this.walletService.getBalance(wallet.address);
          wallet.balance = this.walletService.balance;
          wallet.completebalance = this.walletService.fullbalance;
        }
        this.change.detectChanges();
      }
    }
  }

  open(content: any): void {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public editingWallet(wallet: any, editWallet: any): void {
    this.walletsname = wallet.name ;
    this.walletsaddress = wallet.address;
    this.editwalletname = this.walletsname;
    this.open(editWallet);
  }

  /**
   * Delete a Wallet from the JSON
   * @param name Name of the Wallet to Delete
   */
  public deleteWallet(name: string): void{
    if (name === this.walletsname) {
      if (localStorage.getItem('Wallets') == null) {
        return;
      } else {
        const wallets = JSON.parse(localStorage.getItem('Wallets') || '{}');
        for (let i = 0; i < wallets.name.length; i++) {
          if (this.walletsname === wallets.name[i]) {
            wallets.name.splice(i, 1);
            wallets.address.splice(i, 1);
            this.walletData.deleteData(this.walletsname);
          }
        }
        localStorage.setItem('Wallets', JSON.stringify(wallets));
        this.change.detectChanges();
      }
    } else{
        // Nothing do to maybe check for possibility later
    }
  }

  /**
   * Saves a Wallet Name if a Name get changed to the JSON
   * @param walletName new Name of the Wallet
   */
  public saveWallet(walletName: string): void{
    const name = walletName;
    if (localStorage.getItem('Wallets') == null){
      return;
    }else{
      const wallets = JSON.parse(localStorage.getItem('Wallets') || '{}');
      for (let i = 0; i < wallets.name.length; i++) {
        if (this.editwalletname === wallets.name[i]){
          this.walletData.changeName(wallets.name[i], name);
          wallets.name[i] = name;
        }
        }
      localStorage.setItem('Wallets', JSON.stringify(wallets));
      }
    this.change.detectChanges();
  }

  /**
   * Saves which Wallet to delete
   * @param wallet Wallet which the User wants to delete
   * @param removeWallet Popup of the Wallet remove dialog
   */
  deletingWallet(wallet: any, removeWallet: any): void {
    this.walletsname = wallet.name;
    this.walletsaddress = wallet.address;

    this.open(removeWallet);
  }

  /**
   * Cleanup of the Interval and subscriptions.
   */
  ngOnDestroy(): void {
    clearInterval(this.interval);
    clearInterval(this.interval2);
  }
}

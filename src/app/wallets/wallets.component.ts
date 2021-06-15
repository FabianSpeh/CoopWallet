import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ClipboardService} from 'ngx-clipboard';
import {MultisigWalletDataService} from '../services/multisig-wallet-data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css']
})
export class WalletsComponent implements OnInit {

  constructor(private modalService: NgbModal, public change: ChangeDetectorRef, private clipboardService: ClipboardService,
              public walletService: MultisigWalletDataService) {}
  @ViewChild('walletName') walletNameElement: any;
  @ViewChild('walletAddress') walletAddressElement: any;
  @ViewChild('errorMessage') errorMessage: any;
  closeResult = '';
  walletsname = '';
  editwalletname = '';
  walletsaddress = '';

  // WalletsData contains the Wallets from local storage
  // Currently also holds dummy-data
  walletsData: any[] = [];
  // tslint:disable-next-line:typedef
  name: any;

  convertBalanceString(balance: string): string {
    if (balance.length < 3) {
      return balance;
    } else {
      return this.convertBalanceString(balance.substring(0, balance.length - 3))
        + ' ' + balance.substring(balance.length - 3, balance.length);
    }
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
  async readCookies(): Promise<void> {
    if (localStorage.getItem('Wallets') == null){
      return;
    }
    const wallets = JSON.parse(localStorage.getItem('Wallets') || '{}');
    for (let i = 0; i < wallets.name.length; i++) {
      this.walletService.getWalletJSON(wallets.name[i], wallets.address[i]).then((res) => { this.walletsData.push(res); });
    }
    this.change.detectChanges();
  }

  async ngOnInit(): Promise<void> {
    this.readCookies();
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
          }
        }
        localStorage.setItem('Wallets', JSON.stringify(wallets));
        window.location.reload();
      }
    } else{
      console.log('Nothing');
    }
  }
  public saveWallet(walletName: string): void{
    const name = walletName;
    if (localStorage.getItem('Wallets') == null){
      return;
    }else{
      const wallets = JSON.parse(localStorage.getItem('Wallets') || '{}');
      for (let i = 0; i < wallets.name.length; i++) {
        if (this.editwalletname === wallets.name[i]){
          wallets.name[i] = name;
        }
        }
      console.log(wallets);
      localStorage.setItem('Wallets', JSON.stringify(wallets));
      }
    window.location.reload();
  }

  deletingWallet(wallet: any, removeWallet: any): void {
    this.walletsname = wallet.name;
    this.walletsaddress = wallet.address;

    this.open(removeWallet);
  }
}

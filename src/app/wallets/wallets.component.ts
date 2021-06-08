import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ClipboardService} from 'ngx-clipboard';
import {MultisigWalletDataService} from '../services/multisig-wallet-data.service';



interface Wallet {
  name: string;
  address: string;
  balance: string;
  confirmations: string;
  owners: string;
  pending: string;
  network: string;
}

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css']
})
export class WalletsComponent implements OnInit {

  constructor(public change: ChangeDetectorRef, private clipboardService: ClipboardService,
              public walletService: MultisigWalletDataService) {}

  // WalletsData contains the Wallets from local storage
  // Currently also holds dummy-data
  walletsData = [
    {
      name: 'Multisig Wallet',
      address: '0x2834F1659f9Cd638b4d99EFB264b198917f6Ff5D',
      balance: '1000000',
      confirmations: '3',
      owners: '5',
      pending: '0',
      network: 'Kovan'
    },
    {
      name: 'secure Wallet',
      address: '0x283011659f9Cd638b4d99EFB264b198917f6Ff5D',
      balance: '1',
      confirmations: '7',
      owners: '7',
      pending: '1',
      network: 'Kovan'
    }
  ];

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
      this.getWalletJSON(wallets.name[i], wallets.address[i]).then((res) => { this.walletsData.push(res); });
    }
    this.change.detectChanges();
  }

  /**
   * Returns a Wallet-Promise
   * @param name: the local name of the wallet
   * @param address: the address used to get the wallet information
   */
  getWalletJSON(name: string, address: string): Promise<Wallet> {
    const wallet: Wallet = {
      name, address, balance: '', confirmations: '', owners: '', pending: '', network: ''
    };
    return new Promise<Wallet>((resolve, reject) => {
      this.walletService.getBalance(address)
        .then( () => wallet.balance = this.walletService.balance.toString());
      this.walletService.getNumberOfConfirmations(address)
        .then( () => wallet.confirmations = this.walletService.numberOfConfirmations.toString());
      this.walletService.getNumberOfOwners(address)
        .then( () => wallet.owners = this.walletService.ownerListNumber.toString());
      this.walletService.getTransActionCount(address)
        .then( () => wallet.pending = this.walletService.pendingNonce.toString());
      this.walletService.getNetwork(address)
        .then( () => wallet.network = this.walletService.network.toString());
      resolve(wallet);
    });
  }

  async ngOnInit(): Promise<void> {
    this.readCookies();
  }

}

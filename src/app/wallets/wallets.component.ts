import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ClipboardService} from 'ngx-clipboard';
import {MultisigWalletDataService} from '../services/multisig-wallet-data.service';


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
      this.walletService.getWalletJSON(wallets.name[i], wallets.address[i]).then((res) => { this.walletsData.push(res); });
    }
    this.change.detectChanges();
  }

  async ngOnInit(): Promise<void> {
    this.readCookies();
  }

}

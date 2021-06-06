import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ClipboardService} from 'ngx-clipboard';
import {MultisigWalletDataService} from '../multisig-wallet-data.service';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css']
})
export class WalletsComponent implements OnInit {

  constructor(public change: ChangeDetectorRef, private clipboardService: ClipboardService, public walletService: MultisigWalletDataService,
              private cookieService: CookieService) {}

  walletsData = [
    {
      name: 'Multisig Wallet',
      address: '321AA43B764CD',
      balance: '1000000',
      confirmations: '3',
      owners: '5',
      pending: '0',
      network: 'Kovan'
    },
    {
      name: 'secure Wallet',
      address: '811FF43AB763D2',
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

  formatAddressString(address: string): string {
    return (address.length > 10 ? address.substring(0, 10) : address) + '..';
  }

  copyToClipboard(address: string): void {
    this.clipboardService.copyFromContent(address);
  }

  async readCookies(): Promise<void> {
    const cookieExists: boolean = this.cookieService.check('Wallets');
    if (cookieExists) {
      const wallets = JSON.parse(this.cookieService.get('Wallets'));
      console.log(wallets);
      for (let i = 0; i < wallets.name.length; i++) {
        const address = wallets.address[i];
        await this.walletService.getBalance(address);
        await this.walletService.getNumberOfConfirmations(address);
        await this.walletService.getNumberOfOwners(address);
        await this.walletService.getTransActionCount(address);
        await this.walletService.getNetwork(address);
        this.walletsData.push({
          name: wallets.name[i],
          address: wallets.address[i],
          balance: this.walletService.balance.toString(),
          confirmations: this.walletService.numberOfConfirmations.toString(),
          owners: this.walletService.ownerListNumber.toString(),
          pending: this.walletService.pendingNonce.toString(),
          network: this.walletService.network.toString()
        });
      }
      this.change.detectChanges();
    }
  }

  async ngOnInit(): Promise<void> {
    this.readCookies();
  }

}

import { Component, OnInit } from '@angular/core';
import {ClipboardService} from 'ngx-clipboard';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css']
})
export class WalletsComponent implements OnInit {

  constructor(private clipboardService: ClipboardService) {}

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
    return '0x' + (address.length > 10 ? address.substring(0, 10) : address) + '..';
  }

  copyToClipboard(address: string): void {
    this.clipboardService.copyFromContent(address);
    console.log('copied');
  }

  ngOnInit(): void {
  }

}

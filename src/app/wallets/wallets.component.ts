import { Component, OnInit } from '@angular/core';
import {MultisigWalletDataService} from '../multisig-wallet-data.service';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css']
})
export class WalletsComponent implements OnInit {

  balance: any;

  constructor(public walletService: MultisigWalletDataService)
  {
    //this.etherumEnabled = false;
    //this.dataGot = false;

  }

  async ngOnInit(): Promise<void> {
    await this.walletService.getBalance('0x283011659f9Cd638b4d99EFB264b198917f6Ff5D');
    await this.walletService.getNumberOfConfirmations('0x283011659f9Cd638b4d99EFB264b198917f6Ff5D');
    await this.walletService.getNumberOfOwners('0x283011659f9Cd638b4d99EFB264b198917f6Ff5D');
  }

}

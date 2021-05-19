import { Component, OnInit } from '@angular/core';
import {MultisigWalletDataService} from '../multisig-wallet-data.service';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css']
})
export class WalletsComponent implements OnInit {


  constructor(public walletService: MultisigWalletDataService)
  {
    //this.etherumEnabled = false;
    //this.dataGot = false;

  }

  ngOnInit(): void
  {

  }

}

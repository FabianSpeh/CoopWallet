import { Component, Output, EventEmitter, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {TokensService} from '../services/tokens.service';
import {MultisigWalletDataService, Wallet} from '../services/multisig-wallet-data.service';




@Component({
  selector: 'app-remove-token',
  templateUrl: './remove-token.component.html',
  styleUrls: ['./remove-token.component.css'],
  providers: [NgbActiveModal]
})
export class RemoveTokenComponent {
  @Output() dataToDisplay = new EventEmitter<{tokName: any, tokAddress: string, wallet: Wallet }>();
  @Input() walletForDeleting: any;
  private token = '';
  wallet: any;
  address = '';
  name = '';
  constructor(public activeModal: NgbActiveModal,
              public tokenService: TokensService,
              public walletService: MultisigWalletDataService) {

  }

  async initialiseElement(): Promise<void>{
    this.dataToDisplay.emit({
      tokName: this.name,
      tokAddress: this.address,
      wallet: this.wallet
    });
  }
  async fillTableWhithContent(event: any, address: any, other: Wallet): Promise<void>{
    this.token = event.valueOf();
  /*  const wallAd = this.tokenService.tokenWalletList;
    for ( const elt of wallAd) {
      if ( elt.walletAddress === address){
        await this.tokenService.getTokensOfWallet(this.wallet.address).then((res) => this.tokens = res);
        this.walletAddress = elt.walletAddress;
      }
    }
    for ( const elt of this.tokens){
      if ( elt.name === this.token){
        this.nameToken = elt.name;
        this.tokensDecimals = elt.decimals;
        this.tokensSymbol = elt.symbol;
        this.addressToken = elt.address;
        console.log(this.nameToken, this.tokensDecimals, this.tokensSymbol, this.addressToken);
      }
    }
    console.log(address);
    console.log(this.token);  */
  }

  getWallet( wallet: Wallet): Wallet{
    return wallet;
  }
}


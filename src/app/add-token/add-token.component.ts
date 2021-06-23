import {Component,  ViewChild} from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TokensService} from '../services/tokens.service';



@Component({
  selector: 'app-add-token',
  templateUrl: './add-token.component.html',
  styleUrls: ['./add-token.component.css']
})
export class AddTokenComponent {
tokenAddress: any;
currentWallet: any;
  constructor(public activeModal: NgbActiveModal, public tokenService: TokensService) {
    const parsedUrl = window.location.href;
    this.currentWallet = parsedUrl.split('details/')[1];

  }
  @ViewChild('addressOfToken') addressOfToken: any;
  @ViewChild('nameOfToken') nameOfToken: any;
  @ViewChild('Symbol') symbolofToken: any;
  @ViewChild('Decimals') decimalsOfToken: any;

 async detectInputChange(event: any): Promise<void>{

  this.tokenAddress = event.target.value;
  try {
  if (this.tokenService.web3.utils.isAddress(this.tokenAddress)) {

      const tokenName = await this.tokenService.getTokenName(this.tokenAddress);
      const tokenSymbol = await this.tokenService.getTokenSymbol(this.tokenAddress);
      const tokenDecimals = await this.tokenService.getTokenDecimals(this.tokenAddress);


      this.nameOfToken.nativeElement.value = tokenName;
      this.symbolofToken.nativeElement.value = tokenSymbol;
      this.decimalsOfToken.nativeElement.value = tokenDecimals;

    }
      else{
        this.nameOfToken.nativeElement.value = '';
        this.symbolofToken.nativeElement.value = '';
        this.decimalsOfToken.nativeElement.value = '';
      }

    } catch (error) {alert('Enter a valid address!'); }
  }
    add(): void{
    if (this.tokenService.web3.utils.isAddress(this.tokenAddress)) {
      this.tokenService.saveTokenToLocalStorage(this.tokenAddress, this.currentWallet);
      this.activeModal.close();
    }
    else {
      alert('You have entered an incorrect address!');
    }
    }


  }



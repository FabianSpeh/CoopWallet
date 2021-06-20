import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {MultisigWalletDataService} from '../services/multisig-wallet-data.service';

@Component({
  selector: 'app-add-token',
  templateUrl: './add-token.component.html',
  styleUrls: ['./add-token.component.css']
})
export class AddTokenComponent implements OnInit {
tokenAddress: any;
  constructor(public activeModal: NgbActiveModal) {

  }

  ngOnInit(): void {
  }

  detectInputChange(event: any): void{

  this.tokenAddress = event.target.value;
  console.log(this.tokenAddress);
  }

}

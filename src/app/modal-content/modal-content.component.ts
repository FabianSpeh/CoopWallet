import {Component, ElementRef, Input, ViewChild, Inject} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CookieService} from 'ngx-cookie-service';
import {WalletsComponent} from '../wallets/wallets.component';


@Component({
  selector: 'app-ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-basic-title">Add a Wallet</h4>
    </div>
    <div class="modal-body">
      <form>
        <div class="form-group">
          <label for="nameOfWallet" id="label1" class="label">Name</label>
          <div class="input-group" id="nameInput">
            <input #walletName id="nameOfWallet" type="email" class="form-control" placeholder="Name of Wallet">
          </div>
          <label for="addressofWallet" class="label">Address</label>
          <div class="input-group">
            <input #walletAddress id="addressOfWallet" type="email" class="form-control" placeholder="Address of Wallet">

          </div>
        </div>
        <p #errorMessage hidden="true" style="color: red">You need to specify a <b>Name</b> and an <b>Address</b>!</p>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn btn-outline-light"(click)="save()" >Add</button>
    </div>
  `,
  styleUrls: ['./modal-content.component.css']
})
export class NgbdModalContentComponent {
  @ViewChild('walletName') walletNameElement: any;
  @ViewChild('walletAddress') walletAddressElement: any;
  @ViewChild('errorMessage') errorMessage: any;

  walletName: any;
  walletAddress: any;
  walletList: any;



  constructor(public activeModal: NgbActiveModal, private cookieService: CookieService) {

    this.walletList = {
      name: [],
      address: []
    };

  }
  // triggers when hitting the Add Button in the "Add Wallet" Popup
  save(): any {

    if (this.walletNameElement.nativeElement.value === '' || this.walletAddressElement.nativeElement.value === ''){

    this.errorMessage.nativeElement.hidden = false;
    }

    else{
      this.addCookies();
      this.activeModal.close();
    }


  }


  addCookies(): any {
    // checks if Wallets Cookie already exists and retrieves it
    if (this.cookieService.check('Wallets')){
      this.walletList = JSON.parse(this.cookieService.get('Wallets'));
    }
    // takes wallet Name and wallet Address from Text Inputs
    this.walletName = this.walletNameElement.nativeElement.value;
    this.walletAddress = this.walletAddressElement.nativeElement.value;

    // adds new Wallet name/ Address to Array
    this.walletList.name.push(this.walletName);
    this.walletList.address.push(this.walletAddress);

    // adds new Array to Cookies as Json
    this.cookieService.set('Wallets', JSON.stringify(this.walletList));

    // debugging
    for (let i = 0; i < this.walletList.name.length; i++){

      console.log('Name: ' + this.walletList.name[i] + ' Address: ' + this.walletList.address[i]);

    }

  }

  // gets Wallets Array from Cookies
  getCookies(): any {

    this.walletList = JSON.parse(this.cookieService.get('Wallets'));
    return this.walletList;
  }

}


@Component({
  selector: 'app-modal-content-component',
  templateUrl: './modal-content.component.html'
})
export class ModalContentComponent {
  @ViewChild('walletName') walletName: any;
  constructor(private modalService: NgbModal) {}

  open(): any {
    const modalRef = this.modalService.open(NgbdModalContentComponent);

  }

}


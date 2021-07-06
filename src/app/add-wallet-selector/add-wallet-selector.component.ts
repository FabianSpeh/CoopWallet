import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbdModalContentComponent} from '../modal-content/modal-content.component';
import {CreateWalletComponent} from '../create-wallet/create-wallet.component';

@Component({
  selector: 'app-add-wallet-selector',
  templateUrl: './add-wallet-selector.component.html',
  styleUrls: ['./add-wallet-selector.component.css'],
  providers: [NgbActiveModal]
})
export class AddWalletSelectorComponent implements OnInit {
@ViewChild('walletForm') walletForm: any;
@ViewChild('restoreWallet') restoreWallet: any;
@ViewChild('createWallet') createWallet: any;
  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal) { }

  ngOnInit(): void {
  }
  private openRestoreWallet(): any {
    const modalRef = this.modalService.open(NgbdModalContentComponent);
  }

  private openCreateWallet(): any {
    const modalRef = this.modalService.open(CreateWalletComponent, {size: 'xl'});
  }

  next(): any {
    console.log(this.restoreWallet);
    if (this.restoreWallet.nativeElement.checked){
      this.activeModal.close();
      this.openRestoreWallet(); }
    else if (this.createWallet.nativeElement.checked){
      this.activeModal.close();
      this.openCreateWallet();
    }



    }
  }





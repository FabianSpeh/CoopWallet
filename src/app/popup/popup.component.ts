import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {BrowserRefreshService} from '../services/browser-refresh.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
  encapsulation: ViewEncapsulation.None
})
/**
 * PopupComponent contains the Initial Popup, which explains the Web Application
 */
export class PopupComponent implements OnInit{
  closeResult = '';

  @ViewChild('content') modalContent: any;

  etherumEnabled: boolean;

  async checkData(): Promise<void> {
    this.etherumEnabled = await this.service.checkEthereumConnection();
  }

  /**
   * Opens the Popup onInit, if theres no valid Connection to Metamask
   */
  async ngOnInit(): Promise<void> {
    await this.checkData();
    if (!this.etherumEnabled) {
      this.modalService.open(this.modalContent, {ariaLabelledBy: 'modal-basic-title', size: 'xl'});
    }
  }

  constructor(private modalService: NgbModal, private service: BrowserRefreshService) {
    this.etherumEnabled = false;
  }

  open(content: any): void {

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {

      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {

      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  }


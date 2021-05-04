import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  TemplateRef,
  AfterViewInit,
  ViewChildren
} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';




@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PopupComponent implements OnInit, AfterViewInit {
  closeResult = '';
  dontShowAgain = false;
  @ViewChild('content') modalContent: any;

  @ViewChild('checkbox') checkbox: any;



  constructor(private modalService: NgbModal) { }
  ngOnInit(): void {



  }
  ngAfterViewInit(): void{
    if (!this.dontShowAgain) {
      this.modalService.open(this.modalContent, {ariaLabelledBy: 'modal-basic-title', size: 'xl'});
      console.log(this.checkbox.nativeElement.value);
    }


  }
  open(content: any): void {

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      console.log(this.checkbox);
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
  public DontShowAgain(): void{




  }

  }


import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-remove-token',
  templateUrl: './remove-token.component.html',
  styleUrls: ['./remove-token.component.css'],
  providers: [NgbActiveModal]
})
export class RemoveTokenComponent {
  constructor(public activeModal: NgbActiveModal) {

  }
}

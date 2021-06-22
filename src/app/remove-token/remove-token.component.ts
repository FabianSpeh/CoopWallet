import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-remove-token',
  templateUrl: './remove-token.component.html',
  styleUrls: ['./remove-token.component.css']
})
export class RemoveTokenComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal) {

  }

  ngOnInit(): void {
  }


}

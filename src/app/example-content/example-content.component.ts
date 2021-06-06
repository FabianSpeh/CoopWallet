import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-example-content',
  templateUrl: './example-content.component.html',
  styleUrls: ['./example-content.component.css']
})
export class ExampleContentComponent implements OnInit {
  show = false;

  toggleShow(): void {
    this.show = !this.show;
  }

  constructor() { }
  ngOnInit(): void {
  }

}

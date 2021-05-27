import { Component, OnInit } from '@angular/core';
import {BrowserRefreshService} from './browser-refresh.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dapp';
  constructor(public router: Router){}
}

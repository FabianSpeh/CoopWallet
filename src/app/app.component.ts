import { Component, OnInit } from '@angular/core';
import {BrowserRefreshService} from './services/browser-refresh.service';
import {Router} from '@angular/router';
import {NavbarComponent} from './navbar/navbar.component';
import {PopupComponent} from './popup/popup.component';
import {BackgroundComponent} from './background/background.component';
import {UserWalletDataService} from './services/user-wallet-data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'Coop Wallet';
  constructor(public router: Router, public userService: UserWalletDataService){}
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { WalletsComponent } from './wallets/wallets.component';
import { AddressesComponent } from './addresses/addresses.component';
import { PopupComponent } from './popup/popup.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { BackgroundComponent } from './background/background.component';

// Service class
import { MultisigWalletDataService } from './services/multisig-wallet-data.service';
import {ModalContentComponent, NgbdModalContentComponent} from './modal-content/modal-content.component';
import { WalletDetailsComponent } from './wallet-details/wallet-details.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TransactionsComponent,
    WalletsComponent,
    AddressesComponent,
    PopupComponent,
    BackgroundComponent,
    ModalContentComponent,
    NgbdModalContentComponent,
    WalletDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule
  ],
  providers: [MultisigWalletDataService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }

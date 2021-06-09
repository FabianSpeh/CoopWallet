import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExampleContentComponent } from './example-content/example-content.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { WalletsComponent } from './wallets/wallets.component';
import { AddressesComponent } from './addresses/addresses.component';
import { PopupComponent } from './popup/popup.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { BackgroundComponent } from './background/background.component';

// Service class
import { MultisigWalletDataService } from './multisig-wallet-data.service';
import {ModalContentComponent, NgbdModalContentComponent} from './modal-content/modal-content.component';
import { WalletDetailsComponent } from './wallet-details/wallet-details.component';
import {EditOwnerComponent} from './edit-owner/edit-owner.component';


@NgModule({
  declarations: [
    AppComponent,
    ExampleContentComponent,
    NavbarComponent,
    TransactionsComponent,
    WalletsComponent,
    AddressesComponent,
    PopupComponent,
    BackgroundComponent,
    ModalContentComponent,
    NgbdModalContentComponent,
    WalletDetailsComponent,
    EditOwnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule
  ],
  providers: [MultisigWalletDataService, CookieService, WalletDetailsComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

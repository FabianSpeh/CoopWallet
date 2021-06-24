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
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { BackgroundComponent } from './background/background.component';
import {AddOwnerComponent} from './add-owner/add-owner.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {InsertAbiComponent} from './insert-abi/insert-abi.component';


// Service class
import { MultisigWalletDataService } from './services/multisig-wallet-data.service';
import {ModalContentComponent, NgbdModalContentComponent} from './modal-content/modal-content.component';
import { WalletDetailsComponent } from './wallet-details/wallet-details.component';
import {EditOwnerComponent} from './edit-owner/edit-owner.component';
import {OwnerAddressService} from './services/owner-address.service';
import { AddTokenComponent } from './add-token/add-token.component';



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
    WalletDetailsComponent,
    EditOwnerComponent,
    AddTokenComponent,
    AddOwnerComponent,
    InsertAbiComponent
  ],
  imports: [
    FontAwesomeModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule
  ],
  providers: [MultisigWalletDataService, CookieService, WalletDetailsComponent, OwnerAddressService, NgbActiveModal],
  bootstrap: [AppComponent]
})
export class AppModule { }

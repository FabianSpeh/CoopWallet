import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TransactionsComponent} from './transactions/transactions.component';
import {AddressesComponent} from './addresses/addresses.component';
import {WalletsComponent} from './wallets/wallets.component';
import {WalletDetailsComponent} from './wallet-details/wallet-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/wallets', pathMatch: 'full'},
  { path: 'transactions', component: TransactionsComponent },
  { path: 'addresses', component: AddressesComponent },
  { path: 'wallets', children: [
      { path: '', component: WalletsComponent },
      { path: 'details/:wallet_name', component: WalletDetailsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

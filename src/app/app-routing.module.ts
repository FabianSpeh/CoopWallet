import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TransactionsComponent} from './transactions/transactions.component';
import {AddressesComponent} from './addresses/addresses.component';
import {WalletsComponent} from './wallets/wallets.component';

const routes: Routes = [
  { path: '', redirectTo: '/wallets', pathMatch: 'full'},
  { path: 'transactions', component: TransactionsComponent },
  { path: 'addresses', component: AddressesComponent },
  { path: 'wallets', component: WalletsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

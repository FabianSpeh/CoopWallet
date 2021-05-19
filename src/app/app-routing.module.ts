import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TransactionsComponent} from './transactions/transactions.component';
import {AddressesComponent} from './addresses/addresses.component';
import { WalletsComponent } from './wallets/wallets.component';

const routes: Routes = [
  { path: 'wallets', component: WalletsComponent},
  { path: 'transactions', component: TransactionsComponent},
  { path: 'addresses', component: AddressesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ExampleContentComponent} from "./example-content/example-content.component";
import {TransactionsComponent} from "./transactions/transactions.component";
import {AddressesComponent} from "./addresses/addresses.component";

const routes: Routes = [
  { path: '', component: ExampleContentComponent},
  { path: 'transactions', component: TransactionsComponent},
  { path: 'addresses', component: AddressesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

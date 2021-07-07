import { Injectable } from '@angular/core';
import {Wallet} from './multisig-wallet-data.service';

@Injectable({
  providedIn: 'root'
})
export class WalletDataService {
  public walletsData: any[] = [];
  constructor() { }

  /**
   * Add a Wallet to the Wallet data Array
   * @param data A Wallet for mor info @see multisig-wallet-data.service Wallet.
   */
  public addData(data: Wallet): void{
    this.walletsData.push(data);
  }

  /**
   * Deletes a Wallet from the given Name
   * @param name Name of the Wallet to delete
   */
  public deleteData(name: string): void{
    for (const wallet of this.walletsData){
      if (name === wallet.name){
        this.walletsData.splice(wallet.index, 1);
      }
    }
  }

  /**
   * Change the name of a Wallet
   * @param name Old name of the Wallet
   * @param newName New name of the Wallet
   */
  public changeName(name: string, newName: string): void{
    for (const wallet of this.walletsData) {
      if (name === wallet.name) {
        wallet.name = newName;
      }
    }
  }
}

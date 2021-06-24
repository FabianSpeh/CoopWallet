import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * The OwnerAddressService is used for Communication between the AddOwnerComponent and the WalletDetailsComponent
 */
export class OwnerAddressService {

  private ownerAddress = new BehaviorSubject<string>('default');
  currentAddress = this.ownerAddress.asObservable();

  constructor() {
  }

changeMessage(address: string): any {
    this.ownerAddress.next(address);

}
}

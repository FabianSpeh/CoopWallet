import { Injectable, OnDestroy } from '@angular/core';
import Web3 from 'web3';

declare var window: any;


@Injectable({
  providedIn: 'root'
})


export class BrowserRefreshService implements OnDestroy{
  public etherumCheck = false;
  web3js: any;
  constructor() {
  }

  public checkEtherumConection = async () => {
    try {
      if (window.ethereum){
        this.web3js = new Web3(window.ethereum);
        const test =  await this.web3js.eth.getAccounts();
        if (test.length >= 1){
          this.etherumCheck = true;
        } else {
          this.etherumCheck = false;
        }
        console.log(test);
      }
      console.log(this.etherumCheck + 'HI');
    } catch (err) {
      console.log(err);
      this.etherumCheck =  false;
    }
    console.log('Werte' + this.etherumCheck);
    return this.etherumCheck;
  }

  ngOnDestroy(): void {
  }
}

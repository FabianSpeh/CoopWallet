import { Injectable} from '@angular/core';
import Web3 from 'web3';

declare var window: any;


@Injectable({
  providedIn: 'root'
})


export class BrowserRefreshService {
  public etherumCheck = false;
  web3js: any;
  network: string;
  constructor() {
    this.network = '';
  }

  public checkEtherumConection = async () => {
    try {
      if (window.ethereum){
        this.web3js = new Web3(window.ethereum);
        const test =  await this.web3js.eth.getAccounts();
        this.network = await this.web3js.eth.net.getNetworkType();
        if (test.length >= 1){
          this.etherumCheck = true;
        } else {
          this.etherumCheck = false;
        }
      }
    } catch (err) {
      console.log(err);
      this.etherumCheck =  false;
    }
    return this.etherumCheck;
  }
}

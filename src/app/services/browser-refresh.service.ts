import { Injectable} from '@angular/core';
import Web3 from 'web3';

declare var window: any;


@Injectable({
  providedIn: 'root'
})


export class BrowserRefreshService {
  /**
   * Class to simply check after a BrowserRefresh if there is already a Connection to a ethereum Provider
   * @param ethereumCheck - boolean which save current Status if there is already a connection
   * @param network - saves the name of the current network
   */
  ethereumCheck = false;
  web3js: any;
  network: string;

  /**
   * Set up of network to be empty at start.
   */
  constructor() {
    this.network = '';
  }

  /**
   * Checks if there is already a connection to a ethereum provider and then gets the Network and save it.
   */
  public checkEthereumConnection = async () => {
    try {
      if (window.ethereum){
        this.web3js = new Web3(window.ethereum);
        const test =  await this.web3js.eth.getAccounts();
        this.network = await this.web3js.eth.net.getNetworkType();
        if (test.length >= 1){
          this.ethereumCheck = true;
        } else {
          this.ethereumCheck = false;
        }
      }
    } catch (err) {
      this.ethereumCheck =  false;
    }
    return this.ethereumCheck;
  }
}

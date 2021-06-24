import { Injectable } from '@angular/core';
import Web3 from 'web3';
import {Wallet} from './multisig-wallet-data.service';

declare var window: any;

/**
 * An ERC20 Token JSON
 */
export interface Token {
  name: string;
  address: string;
  symbol: string;
  decimals: number;
  walletBalance: string;
  userBalance: string;
}

/**
 * A TokenWallet is a Multisig-Wallet Address and its corresponding tokens that are saved in local storage
 */
export interface TokenWallet {
  walletAddress: string;
  tokens: Token[];
}

/**
 * The TokenService provides functionality for ERC20 Tokens such as fetching their metadata and saving them to local storage
 */
@Injectable({
  providedIn: 'root'
})
export class TokensService {

  tokenContractABI = [{inputs: [{internalType: 'string', name: 'name_', type: 'string'}, {internalType: 'string', name: 'symbol_', type: 'string'}], stateMutability: 'nonpayable', type: 'constructor'}, {anonymous: false, inputs: [{indexed: true, internalType: 'address', name: 'owner', type: 'address'}, {indexed: true, internalType: 'address', name: 'spender', type: 'address'}, {indexed: false, internalType: 'uint256', name: 'value', type: 'uint256'}], name: 'Approval', type: 'event'}, {anonymous: false, inputs: [{indexed: true, internalType: 'address', name: 'from', type: 'address'}, {indexed: true, internalType: 'address', name: 'to', type: 'address'}, {indexed: false, internalType: 'uint256', name: 'value', type: 'uint256'}], name: 'Transfer', type: 'event'}, {inputs: [], name: 'name', outputs: [{internalType: 'string', name: '', type: 'string'}], stateMutability: 'view', type: 'function'}, {inputs: [], name: 'symbol', outputs: [{internalType: 'string', name: '', type: 'string'}], stateMutability: 'view', type: 'function'}, {inputs: [], name: 'decimals', outputs: [{internalType: 'uint8', name: '', type: 'uint8'}], stateMutability: 'view', type: 'function'}, {inputs: [], name: 'totalSupply', outputs: [{internalType: 'uint256', name: '', type: 'uint256'}], stateMutability: 'view', type: 'function'}, {inputs: [{internalType: 'address', name: 'account', type: 'address'}], name: 'balanceOf', outputs: [{internalType: 'uint256', name: '', type: 'uint256'}], stateMutability: 'view', type: 'function'}, {inputs: [{internalType: 'address', name: 'recipient', type: 'address'}, {internalType: 'uint256', name: 'amount', type: 'uint256'}], name: 'transfer', outputs: [{internalType: 'bool', name: '', type: 'bool'}], stateMutability: 'nonpayable', type: 'function'}, {inputs: [{internalType: 'address', name: 'owner', type: 'address'}, {internalType: 'address', name: 'spender', type: 'address'}], name: 'allowance', outputs: [{internalType: 'uint256', name: '', type: 'uint256'}], stateMutability: 'view', type: 'function'}, {inputs: [{internalType: 'address', name: 'spender', type: 'address'}, {internalType: 'uint256', name: 'amount', type: 'uint256'}], name: 'approve', outputs: [{internalType: 'bool', name: '', type: 'bool'}], stateMutability: 'nonpayable', type: 'function'}, {inputs: [{internalType: 'address', name: 'sender', type: 'address'}, {internalType: 'address', name: 'recipient', type: 'address'}, {internalType: 'uint256', name: 'amount', type: 'uint256'}], name: 'transferFrom', outputs: [{internalType: 'bool', name: '', type: 'bool'}], stateMutability: 'nonpayable', type: 'function'}, {inputs: [{internalType: 'address', name: 'spender', type: 'address'}, {internalType: 'uint256', name: 'addedValue', type: 'uint256'}], name: 'increaseAllowance', outputs: [{internalType: 'bool', name: '', type: 'bool'}], stateMutability: 'nonpayable', type: 'function'}, {inputs: [{internalType: 'address', name: 'spender', type: 'address'}, {internalType: 'uint256', name: 'subtractedValue', type: 'uint256'}], name: 'decreaseAllowance', outputs: [{internalType: 'bool', name: '', type: 'bool'}], stateMutability: 'nonpayable', type: 'function'}];
  web3: any;

  // The tokenWalletList is a list of TokenWallets, that is saved and retrieved from local storage as new Tokens are added.
  tokenWalletList: TokenWallet[];

  constructor() {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
    }
    if (localStorage.getItem('Tokens') == null) {
      // Create the Tokens-Item in local storage if it doesn't exist:
      localStorage.setItem('Tokens', JSON.stringify([]));
    }
    // Load the Tokens-Item from local storage into the tokenWalletList
    this.tokenWalletList = JSON.parse(localStorage.getItem('Tokens') as string);
  }

  /**
   * Returns the name of an ERC20 token. Should be called with await.
   * @param address - the address of the token
   */
  public async getTokenName(address: string): Promise<any> {
    if (this.web3 !== undefined) {
      const tokenContract = new this.web3.eth.Contract(this.tokenContractABI, address);
      return await tokenContract.methods.name().call();
    }
  }

  /**
   * Returns the symbol of an ERC20 token. Should be called with await.
   * @param address - the address of the token
   */
  public async getTokenSymbol(address: string): Promise<any> {
    if (this.web3 !== undefined) {
      const tokenContract = new this.web3.eth.Contract(this.tokenContractABI, address);
      return await tokenContract.methods.symbol().call();
    }
  }

  /**
   * Returns the decimals of an ERC20 token. Should be called with await.
   * @param address - the address of the token
   */
  public async getTokenDecimals(address: string): Promise<any> {
    if (this.web3 !== undefined) {
      const tokenContract = new this.web3.eth.Contract(this.tokenContractABI, address);
      return await tokenContract.methods.decimals().call();
    }
  }

  /**
   * Returns an Array with all the Tokens that are saved in local storage for the given Mutlisig-Wallet.
   * Returns an empty list, if there are no tokens for this Wallet
   * @param address - the address of the Multisig-Wallet
   */
  public getTokensOfWallet(address: string): Token[] {
    const tokenWallet = this.tokenWalletList.find((e: TokenWallet) => e.walletAddress === address);
    return tokenWallet !== undefined ? tokenWallet.tokens : [];
  }

  /**
   * Removes a Token from a Multisig-Wallet in the tokenWalletList. Updates the local storage.
   * @param tokenAddress - the address of the Token
   * @param walletAddress - the address of the Multisig-Wallet
   */
  public removeTokenFromWallet(tokenAddress: string, walletAddress: string): void {
    const tokenWallet = this.tokenWalletList.find((e: TokenWallet) => e.walletAddress === walletAddress);
    if (tokenWallet !== undefined) {
      tokenWallet.tokens = tokenWallet.tokens.filter((e: Token) => e.address !== tokenAddress);
      localStorage.setItem('Tokens', JSON.stringify(this.tokenWalletList));
    }
  }

  /**
   * Adds an ERC20 Token to tokenWalletList. If a token is already in the list it overwrites the old entry.
   * After a token was added, tokenWalletList is saved in local storage
   * @param tokenAddress - the address of the Token
   * @param walletAddress - the address of the Multisig-Wallet
   */
  public async saveTokenToLocalStorage(tokenAddress: string, walletAddress: string): Promise<void> {
    const tokenWallet = this.tokenWalletList.find((e: TokenWallet) => e.walletAddress === walletAddress);
    if (tokenWallet !== undefined) {
      const token = tokenWallet.tokens.find((e: Token) => e.address === tokenAddress);
      if (token !== undefined) {
        console.log('Token already exists. Overwriting.');
        tokenWallet.tokens = tokenWallet.tokens.filter((e: Token) => e.address !== tokenAddress);
      }
      await this.getTokenJSON(tokenAddress, walletAddress).then((res) => { tokenWallet.tokens.push(res); });
      console.log('Saved token in token list for ', walletAddress, ': ', tokenWallet );
      localStorage.setItem('Tokens', JSON.stringify(this.tokenWalletList));
    } else {
      this.tokenWalletList.push({walletAddress, tokens: []} as TokenWallet);
      this.saveTokenToLocalStorage(tokenAddress, walletAddress);
    }
  }

  /**
   * Get Balance from token Contract
   * @param tokenAddress Adresse des Tokens
   * @param walletAddress Adresse des abzufragen Wallets
   */
  public async getBalance(tokenAddress: string, walletAddress: string ): Promise<any> {
    if ( this.web3 !== undefined){
      const tokenContract = new this.web3.eth.Contract(this.tokenContractABI, tokenAddress);
      return await tokenContract.methods.balanceOf(walletAddress).call();
    }
  }

  /**
   * Get user Address
   */
  private async getUserAddres(): Promise<any>{
    let address: any;
    if (window.ethereum) {
      await window.ethereum.request({method: 'eth_requestAccounts'}).then((res: any) => address = res);
    }
    return address;
  }

  /**
   * Private Function to fetch a Token Promise
   * @param address - the address of the Token
   */
  private getTokenJSON(address: string, walletAddress: string): Promise<Token> {
    const token: Token = {
      name: '', address, symbol: '', decimals: 0, walletBalance: '', userBalance: ''
    };
    const tokenContract = new this.web3.eth.Contract(this.tokenContractABI, address);
    return new Promise<Token>(async (resolve, reject) => {
      token.name = await tokenContract.methods.name().call();
      token.symbol = await tokenContract.methods.symbol().call();
      token.decimals = await tokenContract.methods.decimals().call();
      let walletbalance = -1;
      let userbalance = -1;
      await this.getBalance(address, walletAddress).then((res) => walletbalance = res);
      walletbalance = walletbalance / (10 ** token.decimals);
      token.walletBalance = walletbalance.toString();
      await this.getUserAddres().then(async (res) => await this.getBalance(address, res[0]).then((res2) => userbalance = res2));
      userbalance = userbalance / (10 ** token.decimals);
      token.userBalance = userbalance.toString();
      resolve(token);
    });
  }

}

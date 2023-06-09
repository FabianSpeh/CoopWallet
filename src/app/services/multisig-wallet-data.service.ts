import { Injectable } from '@angular/core';

import {ContractAbiService} from '../services/contract-abi.service';

import Web3 from 'web3';

declare var window: any;

export interface Wallet {
  name: string;
  address: string;
  balance: string;
  completebalance: string;
  confirmations: string;
  owners: string;

  pending: string;
  network: string;
}

@Injectable({
  providedIn: 'root'
})
export class MultisigWalletDataService {
  /**
   * Service to help get Data from a Multisig Wallet
   * @param balance Showbalance of the Multisig Wallet with rounding
   * @param fullbalance Balance of the Multisig Wallet without rounding
   * @param accounts Current User Account
   * @param accountIndex Index of the Account
   * @param contract_abi ABI of the Multisig Contract
   * @param numberOfConfirmations Count of the Confirmations of a Multisig Wallet
   * @param ownerListNumber Count of Owners of the Multisig Wallet
   * @param pendingNonce Nonce of the Multisig
   * @param network current network of the User
   * @param lastTransactionSuccess check for if the last TransactionSuccess
   * @param ownerArray All Owner of the Multisig Wallet in a Array
   */
  balance: string;
  fullbalance: string;
  accounts: any;
  web3js: any;
  accountIndex = 0;
  providerOnline = false;
  // tslint:disable-next-line:variable-name
  contract_abi: any;
  numberOfConfirmations: any;
  ownerListNumber: any;
  pendingNonce: any;
  network: any;
  lastTransactionSuccess: any;

  ownerArray: any;

  constructor(public abiService: ContractAbiService) {
    this.balance = '';
    this.fullbalance = '';
    this.contract_abi = '[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"owners","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"removeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"revokeConfirmation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"address"}],"name":"confirmations","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"calcMaxWithdraw","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"pending","type":"bool"},{"name":"executed","type":"bool"}],"name":"getTransactionCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"dailyLimit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastDay","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"addOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"isConfirmed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"getConfirmationCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"transactions","outputs":[{"name":"destination","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"},{"name":"executed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwners","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"from","type":"uint256"},{"name":"to","type":"uint256"},{"name":"pending","type":"bool"},{"name":"executed","type":"bool"}],"name":"getTransactionIds","outputs":[{"name":"_transactionIds","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"getConfirmations","outputs":[{"name":"_confirmations","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transactionCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_required","type":"uint256"}],"name":"changeRequirement","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"confirmTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"destination","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"}],"name":"submitTransaction","outputs":[{"name":"transactionId","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_dailyLimit","type":"uint256"}],"name":"changeDailyLimit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MAX_OWNER_COUNT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"required","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"newOwner","type":"address"}],"name":"replaceOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"executeTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"spentToday","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_owners","type":"address[]"},{"name":"_required","type":"uint256"},{"name":"_dailyLimit","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"dailyLimit","type":"uint256"}],"name":"DailyLimitChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Confirmation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Revocation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Submission","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Execution","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"ExecutionFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"OwnerAddition","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"OwnerRemoval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"required","type":"uint256"}],"name":"RequirementChange","type":"event"}]';
  }

  /**
   * Get the Balance of a Address and round the
   * @param address Address of the Address which we want to check the balance of
   */
  public async getBalance(address: any): Promise<void> {

    if (window.ethereum) {
      this.web3js = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.balance = await this.web3js.eth.getBalance(address);
      let balanceInEther = this.web3js.utils.fromWei(this.balance, 'ether');
      this.fullbalance = balanceInEther + ' ETH';
      if (!balanceInEther.includes('.')){
        balanceInEther = balanceInEther + '.00' + ' ';
      } else {
        let balanceInNumber = Number(balanceInEther);
        balanceInNumber = Math.round((balanceInNumber) * 100) / 100;
        balanceInEther = balanceInNumber.toString();
      }
      this.balance = balanceInEther;
    }
  }

  /**
   * Get the number of confirmations from a Multisig Address
   * @param address Address of the Multisig to get the number of confirmations
   */
  public async getNumberOfConfirmations(address: any): Promise<void> {
    if (window.ethereum) {
      this.web3js = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const MultiSigContract = await new this.web3js.eth.Contract(JSON.parse(this.contract_abi), address);
      await MultiSigContract.methods.required.call().call().then( (res: any) => this.numberOfConfirmations = res);
    }
  }

  /**
   * Get the number of owners from a Multisig Address
   * @param address: Address of the Multisig to get the number of owners count
   */
  async getNumberOfOwners(address: any): Promise<void> {
    if (window.ethereum) {
      this.web3js = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const MultiSigContract = await new this.web3js.eth.Contract(JSON.parse(this.contract_abi), address);
      await MultiSigContract.methods.getOwners().call().then((res: any) => this.ownerListNumber = res.length);
    }
  }

  /**
   * Get the number of transaction from a Multisig Address
   * @param address: Address of the Multisig to get the number transaction count
   */
  async getTransActionCount(address: any): Promise<void> {
    if (window.ethereum) {
      this.web3js = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const MultiSigContract = await new this.web3js.eth.Contract(JSON.parse(this.contract_abi), address);
      await MultiSigContract.methods.getTransactionCount(true, false).call().then((res: any) => this.pendingNonce = res);
    }
  }

  /**
   * Get the current network which the user is
   * @param address: address of the user to check the network from
   */
  async getNetwork(address: any): Promise<void> {
    if (window.ethereum) {
      this.web3js = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await this.web3js.eth.net.getNetworkType(address).then((res: any) => this.network = res);
    }
  }

  /**
   * Returns a Wallet-Promise
   * @param name: the local name of the wallet
   * @param address: the address used to get the wallet information
   */
  public getWalletJSON(name: string, address: string): Promise<Wallet> {
    const wallet: Wallet = {
      name, address, balance: '', completebalance: '', confirmations: '', owners: '', pending: '', network: ''
    };
    return new Promise<Wallet>((resolve, reject) => {
      this.getBalance(address)
        .then( () => {wallet.balance = this.balance.toString(); wallet.completebalance = this.fullbalance.toString(); });
      this.getNumberOfConfirmations(address)
        .then( () => wallet.confirmations = this.numberOfConfirmations.toString());
      this.getNumberOfOwners(address)
        .then( () => wallet.owners = this.ownerListNumber.toString());
      this.getTransActionCount(address)
        .then( () => wallet.pending = this.pendingNonce.toString());
      this.getNetwork(address)
        .then( () => wallet.network = this.network.toString());
      resolve(wallet);
    });
  }
  /**
   * Method adds an owner to the multisig contract
   * @param ownerAddress: The owners adress which should be added
   * @param contractAddress: The address of the multisigwallet contract
   */
  async addOwner(ownerAddress: any, contractAddress: any): Promise<void> {
    if (window.ethereum) {
      this.web3js = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Get the address from the current account
      const accounts = await this.web3js.eth.getAccounts();
      const currentAccountAdress = accounts[0];

      // Get the the contract of the multisigwallet
      const multiSigContract = await new this.web3js.eth.Contract(JSON.parse(this.contract_abi), contractAddress);

      // Converting the addOwner and the owner address which should be added
      const data = multiSigContract.methods.addOwner(ownerAddress).encodeABI();

      // Sending the addOwner() method to the contract
      await multiSigContract.methods
      .submitTransaction(contractAddress, 0, data)
      .send({from: currentAccountAdress}).then((res: any) => this.lastTransactionSuccess = res);
    }
  }

  /**
   * Method removes a owner to the multisig contract
   * @param ownerAddress: The owners adress which should be removed
   * @param contractAddress: The address of the multisigwallet contract
   */
  async removeOwner(ownerAddress: any, contractAddress: any): Promise<void>{
    if (window.ethereum) {
      this.web3js = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Get the address from the current account
      const accounts = await this.web3js.eth.getAccounts();
      const currentAccountAdress = accounts[0];

      // Get the the contract of the multisigwallet
      const multiSigContract = await new this.web3js.eth.Contract(JSON.parse(this.contract_abi), contractAddress);

      // Converting the removeOwner and the owner address which should be removed
      const data = multiSigContract
      .methods
      .removeOwner(ownerAddress).encodeABI();

      // Alternate the contract state by adding a new address to the owner list
      await multiSigContract
      .methods
      .submitTransaction(contractAddress, 0, data).send({from: currentAccountAdress}).then((res: any) => this.lastTransactionSuccess = res);
    }
  }

  /**
   * Get all owners as an array from the Multisig Contract
   * @param address: The address of the multisigwallet contract
   */
  async getOwnerArray(address: any): Promise<void> {
    if (window.ethereum){
      this.web3js = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const MultiSigContract = await new this.web3js.eth.Contract(JSON.parse(this.contract_abi), address);
      await MultiSigContract.methods.getOwners().call().then((res: any) => this.ownerArray = res);
    }
  }

  async getConfirmationsOfTransaction(contractAddress: string, id: number): Promise<any> {
    if (window.ethereum) {
      this.web3js = new Web3(window.ethereum);
      const multiSigContract = await new this.web3js.eth.Contract(JSON.parse(this.contract_abi), contractAddress);
      const confirmations = await multiSigContract.methods.getConfirmations(id).call();
      return confirmations.length;
    }
  }

  /**
   * Get all transactions from an Multisig Contract
   * @param contractAddress address of the Multisig Contract
   * @param from TODO
   * @param to TODO
   */
  async getTransactions(contractAddress: any, from: number, to: number): Promise<any[]> {

    if (window.ethereum) {
      this.web3js = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Get the address from the current account
      const accounts = await this.web3js.eth.getAccounts();
      const currentAccountAddress = accounts[0];

      // Get the multisig contract with the given address
      const multiSigContract = await new this.web3js.eth.Contract(JSON.parse(this.contract_abi), contractAddress);

      // Get the indeces of the transactions
      const transactionIndeces = await multiSigContract.methods.getTransactionIds(from, to, true, true).call();

      const transactionInformationList = [];


      // tslint:disable-next-line:forin
      for (const key in transactionIndeces) {
        const index = transactionIndeces[key];

        // Get the transaction
        const transaction = await multiSigContract.methods.transactions(index).call();

        // Get the id of the transaction in the contract
        const id = index;

        // Get the destination of the transaction
        const destination = transaction.destination;
        // singleTransactionInformation['destination'] = transaction['destination'];

        // Get the value of the transaction
        const value = this.web3js.utils.fromWei(transaction.value, 'ether');

        // Get the data from the transaction
        const data = transaction.data;

        // Sets the unknown flag, if the abi is unknown
        let insertAbiAction = '';

        // Checks, if the contract is known or not
        if (this.abiService.isKnownContract(destination) === true) {
          insertAbiAction = 'NO';
        }
        else
        {
          insertAbiAction = 'YES';
        }


          // Get the owners who confirmed the transactions
        const ownersWhoConfirmed = await multiSigContract.methods.getConfirmations(index).call();

        // Get the execution state of the transactions
        const isExecuted = transaction.executed;

        // Get the possible owner confirm/revoke actions
        const hasOwnerConfirmed = await multiSigContract.methods.confirmations(index, currentAccountAddress).call();

        let ownerAction = '';

        if (isExecuted === false && hasOwnerConfirmed === false) {
           ownerAction = 'CONFIRMATION';
        }
         else if (isExecuted === false && hasOwnerConfirmed === true) {
           ownerAction = 'REVOKE';
 }
         else {
           ownerAction = 'NONE';
        }

        const singleTransactionInformation = {
                                              id,
                                              destination,
                                              value,
                                              data,
                                              insertAbiAction,
                                              ownersWhoConfirmed,
                                              ownerAction,
                                              isExecuted
        };

        transactionInformationList.push(singleTransactionInformation);
      }

      return(transactionInformationList);
    }
    return [];
  }

  /**
   * Get the count of the transaction
   * @param address Address of the Contract to get the count of the transaction from
   */
  async getAllTransactionCount(address: any): Promise<void> {
    if (window.ethereum) {
      this.web3js = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const MultiSigContract = await new this.web3js.eth.Contract(JSON.parse(this.contract_abi), address);
      return await MultiSigContract.methods.getTransactionCount(true, true).call();
    }
  }

  /**
   * TODO
   * @param contractAddress TODO
   * @param transactionID TODO
   */
  async confirmTransaction(contractAddress: any, transactionID: any): Promise<void> {
    if (window.ethereum) {
      this.web3js = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Get the address from the current account
      const accounts = await this.web3js.eth.getAccounts();
      const currentAccountAddress = accounts[0];

      // Get the multisig contract with the given address
      const multiSigContract = await new this.web3js.eth.Contract(JSON.parse(this.contract_abi), contractAddress);

      await multiSigContract.methods.confirmTransaction(transactionID).send({from: currentAccountAddress});

      const confirmationsCount = await multiSigContract.methods.getConfirmationCount(15).call();
      const requiredConfirmations = await multiSigContract.methods.required.call().call();

      // Automaticly execute the transaction if enough owner confirmed the transaction
      if (confirmationsCount >= requiredConfirmations)
      {
        await multiSigContract.methods.executeTransaction(transactionID).send({from: currentAccountAddress});
      }
    }
  }

  /**
   * TODO
   * @param contractAddress TODO
   * @param transactionID TODO
   */
  async revokeTransaction(contractAddress: any, transactionID: any): Promise<void> {
    if (window.ethereum) {
      this.web3js = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Get the address from the current account
      const accounts = await this.web3js.eth.getAccounts();
      const currentAccountAddress = accounts[0];

      // Get the multisig contract with the given address
      const multiSigContract = await new this.web3js.eth.Contract(JSON.parse(this.contract_abi), contractAddress);

      await multiSigContract.methods.revokeConfirmation(transactionID).send({from: currentAccountAddress});
    }
  }

}

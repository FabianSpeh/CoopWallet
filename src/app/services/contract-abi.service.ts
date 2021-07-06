import { Injectable } from '@angular/core';
import Web3 from 'web3';

declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class ContractAbiService {

  web3: any;
  contracts: any;

  constructor() {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
    }
    if (localStorage.getItem('Contracts') == null) {
      // Create the Tokens-Item in local storage if it doesn't exist:
      localStorage.setItem('Contracts', JSON.stringify([]));
    }
    this.contracts = JSON.parse(localStorage.getItem('Contracts') as string);
  }

  /**
   * Returns all method-objects of a given ABI (with type 'function')
   * @param abi - ABI string
   */
  getMethodsFromABI(abi: string): any[] {
    const abiJSON = JSON.parse(abi);
    const methods: object[] = [];
    // tslint:disable-next-line:forin
    for (const key in abiJSON) {
      const functionObj = abiJSON[key];
      if (functionObj.type === 'function') {
        methods.push(functionObj);
      }
    }
    return methods;
  }

  /**
   * Returns an array with all the method-names of a given ABI
   * @param abi - ABI string
   */
  getMethodNamesFromABI(abi: string): string[] {
    const methods = this.getMethodsFromABI(abi);
    const names: string[] = [];
    // tslint:disable-next-line:forin
    for (const key in methods) {
      names.push(methods[key].name);
    }
    return names;
  }

  /**
   * Returns all parameter-objects of a given method
   * @param abi - ABI string
   * @param name - the name as specified in the abi
   */
  getParametersFromMethod(abi: string, name: string): any {
    const methods = this.getMethodsFromABI(abi);
    for (const key in methods) {
      if (methods[key].name === name) {
        return methods[key].inputs;
      }
    }
    return null;
  }

  /**
   * Saves the address, a custom name and all ABI methods and their encoded hex-values of a certain contract in local storage.
   * @param address - address of the contract
   * @param name - the chosen local name
   * @param abi - abi string
   */
  saveABIMethods(address: string, name: string, abi: string): void {
    const abiMethods = this.getMethodsFromABI(abi);

    // tslint:disable-next-line:forin
    for (const contract in this.contracts) {
      if (this.contracts[contract].address === address) {
        return;
      }
    }
    const methods = [];

    // tslint:disable-next-line:forin
    for (const key in abiMethods) {
      const methodName = abiMethods[key].name;
      const signature = this.web3.eth.abi.encodeFunctionSignature(abiMethods[key]);
      methods.push({name: methodName, signature});
    }
    this.contracts.push({address, name, methods});
    localStorage.setItem('Contracts', JSON.stringify(this.contracts));
  }

}


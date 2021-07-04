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

  getMethodNamesFromABI(abi: string): string[] {
    const methods = this.getMethodsFromABI(abi);
    const names: string[] = [];
    // tslint:disable-next-line:forin
    for (const key in methods) {
      names.push(methods[key].name);
    }
    return names;
  }

  getParametersFromMethod(abi: string, name: string): any {
    const methods = this.getMethodsFromABI(abi);
    for (const key in methods) {
      if (methods[key].name === name) {
        return methods[key].inputs;
      }
    }
    return null;
  }

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


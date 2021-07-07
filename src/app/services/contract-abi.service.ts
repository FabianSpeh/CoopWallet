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
   * Method creates a list of method names
   * @param abi The ABI of the contranct
   * @return string[] With the names of the methods from the
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
   * Method saves the contract information in the local storage
   * @param address The address of the contract
   * @param name The name of the contract
   * @param abi The ABI of the contract
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
    this.contracts.push({address, name, abi, methods});
    localStorage.setItem('Contracts', JSON.stringify(this.contracts));
  }

  /**
   * Method checks, if the contract with the ABI is in the local storage
   * @param address the Addres of the Contract
   */
  isKnownContract(address: string): boolean {
    // tslint:disable-next-line:forin
    for (const contract in this.contracts) {
      if (this.contracts[contract].address === address) {
        return true;
      }
    }
    return false;
  }


  getMethodNameFromData(data: string, address: string): string {
    const methodSignature = data.slice(0, 10);
    const methodParameterValue = data.slice(10);

    // Runs through the contracts in the local storage to find a saved one
    for (const contractKey in this.contracts) {
      const contract = this.contracts[contractKey];

      // Block will be executed, if a contract was found
      if (contract.address === address) {

        // tslint:disable-next-line:forin
        for (const methodKey in contract.methods) {
          const method = contract.methods[methodKey];

          if (method.signature === methodSignature) {
            const parameters = this.getParametersFromMethod(contract.abi, method.name);

            try {
              const parameterValue = this.web3.eth.abi.decodeParameters(parameters, methodParameterValue);

              const lengthOfParameterKeys = Object.keys(parameterValue).length;
              const startPosition = Math.floor(lengthOfParameterKeys / 2) + 1;

              const sliced = Object.entries(parameterValue).slice(startPosition, lengthOfParameterKeys);

              let outputParameterString = '';

              // tslint:disable-next-line:forin
              for (const key in sliced)
              {
                const oneParameter = sliced[key];
                const parameterString = oneParameter[0] + ' = ' + oneParameter[1] + ',';
                outputParameterString += parameterString;
              }

              outputParameterString = outputParameterString.slice(0, -1);

              return method.name + '(' + outputParameterString + ')';
            }
            catch (e)
            {
              return data.substring(0, 12) + '...';
            }
          }
        }

      }
    }

    return data.substring(0, 12) + '...';
  }

}


import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {ContractAbiService} from '../services/contract-abi.service';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css'],
  providers: [NgbActiveModal]
})
export class AddTransactionComponent implements OnInit {
  @ViewChild('ABIString') ABIstring: any;
  @ViewChild('selectedMeth') selectMeth: any;
  disableElement: boolean = true;
  methodes: any;
  selectMethode: HTMLElement | null | undefined;

  constructor(public activeModal: NgbActiveModal, public abiService: ContractAbiService) { }

  ngOnInit(): void {
  }

  /**
   * Methode to get methode's list and alsa unlock the input for selecting a methode
   */
  getMethodes(): void{
    if (this.ABIstring.nativeElement.value !== ''){
      this.methodes =  this.abiService.getMethodNamesFromABI(this.ABIstring.nativeElement.value);
      if (this.methodes !== ''){
        this.selectMethode = document.getElementById('possibleMethodes');
        if (this.selectMethode !== null) {
          this.selectMethode.classList.remove('blocked');
        }
        this.disableElement = false;
      }
    }else {
      this.disableElement = true;
      this.methodes = '';
      if (this.selectMethode !== undefined && this.selectMethode !== null) {
        this.selectMethode.classList.add('blocked');
      }
    }
  }

  /**
   * Methode to get the selected Methode
   */
  getSelectedMethode( ): void {
    console.log( this.selectMeth.nativeElement.value );
    const methode = this.abiService.getParametersFromMethod(this.ABIstring.nativeElement.value, this.selectMeth.nativeElement.value);
    this.createInputField(methode);
  }

  /**
   * methode to create the needed InputFealds
   * @param needed Parameter Object
   */
  createInputField(needed: []): void {
    console.log(needed);
    this.removeAdded();
    if (needed.length >= 0){
      let container: HTMLElement;
      container = document.createElement('div');
      container.classList.add('mt-3');
      container.classList.add('mb-1');
      container.classList.add('form-group');
      container.setAttribute('id', 'added');
      const parent = document.getElementById('lastElement');

      const message = document.createElement('div');
      message.innerHTML = '<h4>Paramters</h4><br>';

      if (container !== null){
        container.appendChild(message);
      }

      for (const inputField of needed){
        const name = this.getName(inputField);
        const lab = document.createElement('label');
        if ( name !== null){
          lab.classList.add('label');
          lab.setAttribute('for', 'name');
          lab.innerHTML = '<h5> ' + name + ' </h5>';
          const inputF = document.createElement('input');
          inputF.classList.add('form-control');
          inputF.classList.add('inputDesign');
          inputF.setAttribute('type', this.getType(inputField));
          if (container !== null) {
            container.appendChild(lab);
            container.appendChild(inputF);
          }
        }
      }

      if (parent !== null){
        parent.appendChild(container);
      }
    }
  }

  /**
   * methode to get the name of the InputField
   * @param obj methode object
   */
  getName(obj: {name: string, type: string}): string {
    return obj.name;
  }

  /**
   * methode to get the Type of the input
   * @param obj methode object
   */
  getType(obj: {name: string, type: string}): string {
    return obj.type;
  }

  /**
   * methode to clean the added div
   */
  removeAdded(): void{
    const toRemove = document.getElementById('added');
    if (toRemove !== null){
      toRemove.remove();
    }

  }
}

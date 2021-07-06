import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWalletSelectorComponent } from './add-wallet-selector.component';

describe('AddWalletSelectorComponent', () => {
  let component: AddWalletSelectorComponent;
  let fixture: ComponentFixture<AddWalletSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWalletSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWalletSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

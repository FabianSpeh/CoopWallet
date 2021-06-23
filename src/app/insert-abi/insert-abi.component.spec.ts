import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertAbiComponent } from './insert-abi.component';

describe('InsertAbiComponent', () => {
  let component: InsertAbiComponent;
  let fixture: ComponentFixture<InsertAbiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertAbiComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertAbiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

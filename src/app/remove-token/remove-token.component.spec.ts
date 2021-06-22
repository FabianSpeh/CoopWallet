import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveTokenComponent } from './remove-token.component';

describe('RemoveTokenComponent', () => {
  let component: RemoveTokenComponent;
  let fixture: ComponentFixture<RemoveTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveTokenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

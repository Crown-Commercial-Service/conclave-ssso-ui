import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerConfirmComponent } from './confirm.component';

describe('BuyerConfirmComponent', () => {
  let component: BuyerConfirmComponent;
  let fixture: ComponentFixture<BuyerConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

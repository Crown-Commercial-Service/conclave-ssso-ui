import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerConfirmChangesComponent } from './confirm.component';

describe('BuyerConfirmChangesComponent', () => {
  let component: BuyerConfirmChangesComponent;
  let fixture: ComponentFixture<BuyerConfirmChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerConfirmChangesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerConfirmChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerBothRequestsSuccessComponent } from './buyer-both-requests-success.component';

describe('BuyerBothRequestsSuccessComponent', () => {
  let component: BuyerBothRequestsSuccessComponent;
  let fixture: ComponentFixture<BuyerBothRequestsSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerBothRequestsSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerBothRequestsSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

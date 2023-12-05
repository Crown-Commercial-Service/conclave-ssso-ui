import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerBothRequestsComponent } from './buyer-both-requests.component';

describe('BuyerBothRequestsComponent', () => {
  let component: BuyerBothRequestsComponent;
  let fixture: ComponentFixture<BuyerBothRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerBothRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerBothRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

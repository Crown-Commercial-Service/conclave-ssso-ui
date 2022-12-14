import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerBothErrorComponent } from './buyer-both-error.component';

describe('BuyerBothErrorComponent', () => {
  let component: BuyerBothErrorComponent;
  let fixture: ComponentFixture<BuyerBothErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerBothErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerBothErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

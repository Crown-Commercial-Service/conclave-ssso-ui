import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerSuccessComponent } from './success.component';

describe('BuyerErrorComponent', () => {
  let component: BuyerSuccessComponent;
  let fixture: ComponentFixture<BuyerSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

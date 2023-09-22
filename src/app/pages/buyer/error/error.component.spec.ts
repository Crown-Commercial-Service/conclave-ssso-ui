import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerErrorComponent } from './error.component';

describe('BuyerErrorComponent', () => {
  let component: BuyerErrorComponent;
  let fixture: ComponentFixture<BuyerErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessRightToBuyComponent } from './success-right-to-buy.component';

describe('SuccessRightToBuyComponent', () => {
  let component: SuccessRightToBuyComponent;
  let fixture: ComponentFixture<SuccessRightToBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessRightToBuyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessRightToBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

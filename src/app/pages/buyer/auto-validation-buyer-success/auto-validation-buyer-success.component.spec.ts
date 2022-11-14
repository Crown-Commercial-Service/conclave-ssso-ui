import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoValidationBuyerSuccessComponent } from './auto-validation-buyer-success.component';

describe('AutoValidationBuyerSuccessComponent', () => {
  let component: AutoValidationBuyerSuccessComponent;
  let fixture: ComponentFixture<AutoValidationBuyerSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoValidationBuyerSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoValidationBuyerSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

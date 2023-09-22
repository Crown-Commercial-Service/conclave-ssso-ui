import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperBuyerBothService } from './wrapper-buyer-both.service';

describe('WrapperBuyerBothService', () => {
  let component: WrapperBuyerBothService;
  let fixture: ComponentFixture<WrapperBuyerBothService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrapperBuyerBothService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperBuyerBothService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

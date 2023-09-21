import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerSearchComponent } from './search.component';

describe('BuyerErrorComponent', () => {
  let component: BuyerSearchComponent;
  let fixture: ComponentFixture<BuyerSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

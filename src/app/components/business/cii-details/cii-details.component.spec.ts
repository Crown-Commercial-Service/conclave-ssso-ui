import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CIIOrgDetails } from './cii-details.component';

describe('CIIOrgDetails', () => {
  let component: CIIOrgDetails;
  let fixture: ComponentFixture<CIIOrgDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CIIOrgDetails ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CIIOrgDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

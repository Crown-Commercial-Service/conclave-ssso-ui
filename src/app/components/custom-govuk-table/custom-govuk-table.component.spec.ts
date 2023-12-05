import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomGovukTableComponent } from './custom-govuk-table.component';

describe('CustomGovukTableComponent', () => {
  let component: CustomGovukTableComponent;
  let fixture: ComponentFixture<CustomGovukTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomGovukTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomGovukTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

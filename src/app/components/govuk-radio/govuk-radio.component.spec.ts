import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukRadioComponent } from './govuk-radio.component';

describe('GovukRadioComponent', () => {
  let component: GovukRadioComponent;
  let fixture: ComponentFixture<GovukRadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GovukRadioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GovukRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

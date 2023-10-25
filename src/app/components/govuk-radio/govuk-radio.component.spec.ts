import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GovukRadioComponent } from './govuk-radio.component';

describe('GovukRadioComponent', () => {
  let component: GovukRadioComponent;
  let fixture: ComponentFixture<GovukRadioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [GovukRadioComponent]
    });
    fixture = TestBed.createComponent(GovukRadioComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

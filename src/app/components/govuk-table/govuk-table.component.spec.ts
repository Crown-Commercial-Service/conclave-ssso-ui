import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovUKTableComponent } from './govuk-table.component';

describe('GovUKTableComponent', () => {
  let component: GovUKTableComponent;
  let fixture: ComponentFixture<GovUKTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GovUKTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GovUKTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

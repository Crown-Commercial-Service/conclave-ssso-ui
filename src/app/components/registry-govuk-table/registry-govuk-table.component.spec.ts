import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryGovukTableComponent } from './registry-govuk-table.component';

describe('RegistryGovukTableComponent', () => {
  let component: RegistryGovukTableComponent;
  let fixture: ComponentFixture<RegistryGovukTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistryGovukTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistryGovukTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

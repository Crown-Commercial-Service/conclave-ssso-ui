import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegAdditionalIdentifiersComponent } from './manage-organisation-registration-additional-identifiers.component';

describe('ManageOrgRegAdditionalIdentifiersComponent', () => {
  let component: ManageOrgRegAdditionalIdentifiersComponent;
  let fixture: ComponentFixture<ManageOrgRegAdditionalIdentifiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegAdditionalIdentifiersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegAdditionalIdentifiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

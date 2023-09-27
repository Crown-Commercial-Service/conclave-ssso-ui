import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgRegDetails } from './reg-org-details.component';

describe('OrgRegDetails', () => {
  let component: OrgRegDetails;
  let fixture: ComponentFixture<OrgRegDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgRegDetails ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgRegDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

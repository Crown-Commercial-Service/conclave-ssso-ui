import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegOrgNotFoundComponent } from './manage-organisation-registration-error-not-my-organisation.component';

describe('ManageOrgRegOrgNotFoundComponent', () => {
  let component: ManageOrgRegOrgNotFoundComponent;
  let fixture: ComponentFixture<ManageOrgRegOrgNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegOrgNotFoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegOrgNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

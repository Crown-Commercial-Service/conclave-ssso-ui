import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegErrorGenericComponent } from './manage-organisation-registration-error-generic.component';

describe('ManageOrgRegErrorGenericComponent', () => {
  let component: ManageOrgRegErrorGenericComponent;
  let fixture: ComponentFixture<ManageOrgRegErrorGenericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegErrorGenericComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegErrorGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

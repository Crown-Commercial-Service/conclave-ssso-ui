import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegErrorComponent } from './manage-organisation-registration-error.component';

describe('ManageOrgRegErrorComponent', () => {
  let component: ManageOrgRegErrorComponent;
  let fixture: ComponentFixture<ManageOrgRegErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

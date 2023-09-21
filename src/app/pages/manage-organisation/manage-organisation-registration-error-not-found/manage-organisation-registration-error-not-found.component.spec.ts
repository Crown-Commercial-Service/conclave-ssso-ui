import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegErrorNotFoundComponent } from './manage-organisation-registration-error-not-found.component';

describe('ManageOrgRegErrorNotFoundComponent', () => {
  let component: ManageOrgRegErrorNotFoundComponent;
  let fixture: ComponentFixture<ManageOrgRegErrorNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegErrorNotFoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegErrorNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

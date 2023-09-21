import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegNotifyAdminComponent} from './manage-reg-organisation-admin-notify.component';

describe('ManageOrgRegNotifyAdminComponent', () => {
  let component: ManageOrgRegNotifyAdminComponent;
  let fixture: ComponentFixture<ManageOrgRegNotifyAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegNotifyAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegNotifyAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

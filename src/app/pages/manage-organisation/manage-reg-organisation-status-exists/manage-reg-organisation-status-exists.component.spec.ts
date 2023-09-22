import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegSearchStatusExistsComponent} from './manage-reg-organisation-status-exists.component';

describe('ManageOrgRegSearchStatusExistsComponent', () => {
  let component: ManageOrgRegSearchStatusExistsComponent;
  let fixture: ComponentFixture<ManageOrgRegSearchStatusExistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegSearchStatusExistsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegSearchStatusExistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

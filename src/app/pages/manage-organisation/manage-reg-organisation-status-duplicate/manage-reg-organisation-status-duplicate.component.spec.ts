import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegSearchStatusDuplicateComponent} from './manage-reg-organisation-status-duplicate.component';

describe('ManageOrgRegSearchStatusDuplicateComponent', () => {
  let component: ManageOrgRegSearchStatusDuplicateComponent;
  let fixture: ComponentFixture<ManageOrgRegSearchStatusDuplicateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegSearchStatusDuplicateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegSearchStatusDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

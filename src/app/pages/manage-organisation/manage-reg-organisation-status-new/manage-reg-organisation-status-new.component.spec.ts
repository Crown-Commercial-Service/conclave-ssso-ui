import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegSearchStatusNewComponent} from './manage-reg-organisation-status-new.component';

describe('ManageOrgRegSearchStatusNewComponent', () => {
  let component: ManageOrgRegSearchStatusNewComponent;
  let fixture: ComponentFixture<ManageOrgRegSearchStatusNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegSearchStatusNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegSearchStatusNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegSearchComponent} from './manage-reg-organisation-search.component';

describe('ManageOrgRegSearchComponent', () => {
  let component: ManageOrgRegSearchComponent;
  let fixture: ComponentFixture<ManageOrgRegSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserAddSingleUserDetailComponent } from './manage-user-add-single-user-detail.component';

describe('ManageUserAddSingleUserDetailComponent', () => {
  let component: ManageUserAddSingleUserDetailComponent;
  let fixture: ComponentFixture<ManageUserAddSingleUserDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserAddSingleUserDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserAddSingleUserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

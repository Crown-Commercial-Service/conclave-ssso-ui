import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserProfilesComponent } from './manage-user-profiles-component';

describe('ManageUserProfilesComponent', () => {
  let component: ManageUserProfilesComponent;
  let fixture: ComponentFixture<ManageUserProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserProfilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

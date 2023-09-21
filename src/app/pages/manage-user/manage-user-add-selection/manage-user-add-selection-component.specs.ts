import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserAddSelectionComponent } from './manage-user-add-selection-component';

describe('ManageUserAddSelectionComponent', () => {
  let component: ManageUserAddSelectionComponent;
  let fixture: ComponentFixture<ManageUserAddSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserAddSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserAddSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

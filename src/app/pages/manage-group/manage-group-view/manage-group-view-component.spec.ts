import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGroupViewComponent } from './manage-group-view-component';

describe('ManageGroupViewComponent', () => {
  let component: ManageGroupViewComponent;
  let fixture: ComponentFixture<ManageGroupViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageGroupViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGroupListComponent } from './manage-group-list-component';

describe('ManageGroupListComponent', () => {
  let component: ManageGroupListComponent;
  let fixture: ComponentFixture<ManageGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageGroupListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

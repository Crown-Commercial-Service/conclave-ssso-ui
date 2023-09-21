import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGroupEditNameComponent } from './manage-group-edit-name-component';

describe('ManageGroupEditNameComponent', () => {
  let component: ManageGroupEditNameComponent;
  let fixture: ComponentFixture<ManageGroupEditNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageGroupEditNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupEditNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

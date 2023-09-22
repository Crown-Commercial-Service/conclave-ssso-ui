import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGroupOperationSuccessComponent } from './manage-group-operation-success-component';

describe('ManageGroupOperationSuccessComponent', () => {
  let component: ManageGroupOperationSuccessComponent;
  let fixture: ComponentFixture<ManageGroupOperationSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageGroupOperationSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupOperationSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

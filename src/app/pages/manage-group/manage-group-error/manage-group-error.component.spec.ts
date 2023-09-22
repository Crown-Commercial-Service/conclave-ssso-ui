import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGroupErrorComponent } from './manage-group-error.component';

describe('ManageGroupErrorComponent', () => {
  let component: ManageGroupErrorComponent;
  let fixture: ComponentFixture<ManageGroupErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageGroupErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOrgTypeComponent } from './update-org-type.component';

describe('UpdateOrgTypeComponent', () => {
  let component: UpdateOrgTypeComponent;
  let fixture: ComponentFixture<UpdateOrgTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateOrgTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateOrgTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

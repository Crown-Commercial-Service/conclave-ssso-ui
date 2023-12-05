import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmOrgTypeComponent } from './confirm-org-type.component';

describe('ConfirmOrgTypeComponent', () => {
  let component: ConfirmOrgTypeComponent;
  let fixture: ComponentFixture<ConfirmOrgTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmOrgTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmOrgTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

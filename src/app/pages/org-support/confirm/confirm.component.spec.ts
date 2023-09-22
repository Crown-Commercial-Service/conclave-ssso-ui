import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgSupportConfirmComponent } from './confirm.component';

describe('OrgSupportConfirmComponent', () => {
  let component: OrgSupportConfirmComponent;
  let fixture: ComponentFixture<OrgSupportConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgSupportConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgSupportConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

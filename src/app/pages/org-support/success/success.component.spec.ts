import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgSupportSuccessComponent } from './success.component';

describe('OrgSupportSuccessComponent', () => {
  let component: OrgSupportSuccessComponent;
  let fixture: ComponentFixture<OrgSupportSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgSupportSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgSupportSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

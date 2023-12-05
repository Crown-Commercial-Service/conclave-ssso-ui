import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessOrgServiceComponent } from './success-org-service.component';

describe('SuccessOrgServiceComponent', () => {
  let component: SuccessOrgServiceComponent;
  let fixture: ComponentFixture<SuccessOrgServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessOrgServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessOrgServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

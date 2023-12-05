import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmOrgServiceComponent } from './confirm-org-service.component';

describe('ConfirmOrgServiceComponent', () => {
  let component: ConfirmOrgServiceComponent;
  let fixture: ComponentFixture<ConfirmOrgServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmOrgServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmOrgServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

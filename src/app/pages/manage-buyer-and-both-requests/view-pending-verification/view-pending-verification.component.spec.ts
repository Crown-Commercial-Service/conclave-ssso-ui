import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPendingVerificationComponent } from './view-pending-verification.component';

describe('ViewPendingVerificationComponent', () => {
  let component: ViewPendingVerificationComponent;
  let fixture: ComponentFixture<ViewPendingVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPendingVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPendingVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

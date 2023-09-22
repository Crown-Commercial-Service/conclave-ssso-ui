import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MFAService } from './mfa.service';

describe('MFAService', () => {
  let component: MFAService;
  let fixture: ComponentFixture<MFAService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MFAService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MFAService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

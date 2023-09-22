import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditLoggerService } from './logger.service';

describe('AuditLoggerService', () => {
  let component: AuditLoggerService;
  let fixture: ComponentFixture<AuditLoggerService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditLoggerService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditLoggerService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

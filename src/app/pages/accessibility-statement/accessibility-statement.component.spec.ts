import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { AccessibilityStatementComponent } from './accessibility-statement.component';

describe('AccessibilityStatementComponent', () => {
  let component: AccessibilityStatementComponent;
  let fixture: ComponentFixture<AccessibilityStatementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccessibilityStatementComponent],
    });
    fixture = TestBed.createComponent(AccessibilityStatementComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize userName as an empty string', () => {
    expect(component.userName).toEqual('');
  });

  it('should initialize isOrgAdmin as false', () => {
    expect(component.isOrgAdmin).toBe(false);
  });

  it('should call window.print() when print() is invoked', () => {
    spyOn(window, 'print');
    component.print();
    expect(window.print).toHaveBeenCalled();
  });
});

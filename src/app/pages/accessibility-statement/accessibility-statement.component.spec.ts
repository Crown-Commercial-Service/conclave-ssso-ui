import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { AccessibilityStatementComponent } from './accessibility-statement.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AccessibilityStatementComponent', () => {
  let component: AccessibilityStatementComponent;
  let fixture: ComponentFixture<AccessibilityStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [AccessibilityStatementComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessibilityStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize userName and isOrgAdmin properties', () => {
    expect(component.userName).toBeDefined();
    expect(component.isOrgAdmin).toBeDefined();
  });

  it('should print the page when print() method is called', () => {
    spyOn(window, 'print');
    component.print('cancel');
    expect(window.print).toHaveBeenCalled();
  });
});

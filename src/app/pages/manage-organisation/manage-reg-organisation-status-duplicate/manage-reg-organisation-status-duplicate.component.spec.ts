import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageOrgRegSearchStatusDuplicateComponent } from './manage-reg-organisation-status-duplicate.component';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('ManageOrgRegSearchStatusDuplicateComponent', () => {
  let component: ManageOrgRegSearchStatusDuplicateComponent;
  let fixture: ComponentFixture<ManageOrgRegSearchStatusDuplicateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageOrgRegSearchStatusDuplicateComponent],
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),

      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ManageOrgRegSearchStatusDuplicateComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properties correctly', () => {
    expect(component.singleOrgExists).toBeFalse();
    expect(component.multipleOrgExists).toBeFalse();
    expect(component.orgNotExists).toBeFalse();
    expect(component.ciiOrgId).toBe('');
    expect(component.schemeName).toBe('');
  });

  it('should go back in history when goBack() is called', () => {
    spyOn(window.history, 'back');
    component.goBack();
    expect(window.history.back).toHaveBeenCalled();
  });
});

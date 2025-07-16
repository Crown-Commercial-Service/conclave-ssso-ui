import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

import { ManageOrgRegSearchComponent } from './manage-reg-organisation-search.component';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { PatternService } from 'src/app/shared/pattern.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('ManageOrgRegSearchComponent', () => {
  let component: ManageOrgRegSearchComponent;
  let fixture: ComponentFixture<ManageOrgRegSearchComponent>;
  let organisationService: OrganisationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,        
        MatAutocompleteModule,
        BrowserAnimationsModule,        
        StoreModule.forRoot({}),
        TranslateModule.forRoot(),
        ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' })
      ],
      declarations: [ManageOrgRegSearchComponent],
      providers: [OrganisationService, PatternService,
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegSearchComponent);
    component = fixture.componentInstance;
    organisationService = TestBed.inject(OrganisationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.formGroup).toBeDefined();
    expect(component.formGroup.get('firstName')).toBeDefined();
    expect(component.formGroup.get('lastName')).toBeDefined();
    expect(component.formGroup.get('email')).toBeDefined();
    expect(component.formGroup.get('organisation')).toBeDefined();
  });

  it('should update filteredOptions when doFilter is called', () => {
    spyOn(organisationService, 'getByName').and.returnValue(of([]));

    const result$: Observable<any> = component.doFilter('example');

    result$.subscribe((result) => {
      expect(organisationService.getByName).toHaveBeenCalledWith(
        'example',
        false
      );
      expect(result).toEqual([]);
    });
  });

  it('should set showMoreOptionsVisible to true and call autocomplete.openPanel when showMoreClicked is called', () => {
    component.showMoreOptionsVisible = false;
    spyOn(component.autocomplete, 'openPanel');

    component.showMoreClicked('Show more');

    expect(component.showMoreOptionsVisible).toBe(true);
  });

  it('should set focus on the specified input element when setFocus is called', () => {
    const inputIndex = 0;
    const inputElement =
      fixture.nativeElement.querySelectorAll('input')[inputIndex];
    spyOn(inputElement, 'focus');

    component.setFocus(inputIndex);

    expect(inputElement.focus).toHaveBeenCalled();
  });
});

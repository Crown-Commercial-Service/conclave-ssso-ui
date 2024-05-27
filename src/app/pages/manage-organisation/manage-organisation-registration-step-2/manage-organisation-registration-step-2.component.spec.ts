import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

import { ManageOrgRegStep2Component } from './manage-organisation-registration-step-2.component';
import { ciiService } from 'src/app/services/cii/cii.service';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { SchemePipe } from 'src/app/pipes/scheme.pipe';

describe('ManageOrgRegStep2Component', () => {
  let component: ManageOrgRegStep2Component;
  let fixture: ComponentFixture<ManageOrgRegStep2Component>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let ciiServiceMock: Partial<ciiService>;
  let sharedDataServiceMock: Partial<SharedDataService>;

  beforeEach(async () => {
    ciiServiceMock = {
      getSchemes: () =>
        of([{ scheme: 'GB-COH', schemeName: 'Companies House' }]),
    };

    sharedDataServiceMock = {
      checkBlockedScheme: () => true,
    };

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ManageOrgRegStep2Component, SchemePipe],
      providers: [
        { provide: ciiService, useValue: ciiServiceMock },
        { provide: SharedDataService, useValue: sharedDataServiceMock },
        { provide: Store, useFactory: () => ({}) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegStep2Component);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set the items$ observable and select the first scheme', () => {
      component.ngOnInit();
      expect(component.items$).toBeDefined();
      component.items$.subscribe((result) => {
        expect(result).toEqual([
          { scheme: 'GB-COH', schemeName: 'Companies House' },
        ]);
      });
      expect(component.scheme).toBe('GB-COH');
      expect(component.schemeName).toBe('Companies House');
    });
  });

  describe('onSubmit', () => {
    it('should navigate to the search page with the selected scheme and ID', () => {
      component.scheme = 'GB-COH';
      component.txtValue = '12345';
      spyOn(router, 'navigateByUrl');
      component.onSubmit('Continue');
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        `manage-org/register/search/GB-COH?id=${encodeURIComponent('12345')}`
      );
    });

    it('should scroll to the error summary if no ID is entered', () => {
      component.scheme = 'GB-COH';
      component.txtValue = '';
      spyOn(component.scrollHelper, 'scrollToFirst');
      component.onSubmit('Continue');
      expect(component.scrollHelper.scrollToFirst).toHaveBeenCalledWith(
        'error-summary'
      );
    });
  });

  describe('onBackClick', () => {
    it('should navigate back to the previous page', () => {
      spyOn(window.history, 'back');
      component.onBackClick();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});

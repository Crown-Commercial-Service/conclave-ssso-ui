import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { ManageOrganisationSiteEditComponent } from './manage-organisation-profile-site-edit.component';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('ManageOrganisationSiteEditComponent', () => {
  let component: ManageOrganisationSiteEditComponent;
  let fixture: ComponentFixture<ManageOrganisationSiteEditComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageOrganisationSiteEditComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatSelectModule,
        NgxMatSelectSearchModule,
        MatInputModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                data: JSON.stringify({ isEdit: true, siteId: 1 }),
              },
            },
          },
        },
        { provide: Store, useFactory: () => ({}) },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationSiteEditComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the correct URL when onCancelClick is called', () => {
    spyOn(router, 'navigateByUrl');

    component.onCancelClick('Cancel');

    expect(router.navigateByUrl).toHaveBeenCalledWith('manage-org/profile');
  });
});

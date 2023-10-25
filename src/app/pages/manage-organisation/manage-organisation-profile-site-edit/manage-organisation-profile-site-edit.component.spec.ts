import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { ManageOrganisationSiteEditComponent } from './manage-organisation-profile-site-edit.component';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

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
        RouterTestingModule,
        MatSelectModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
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

    component.onCancelClick();

    expect(router.navigateByUrl).toHaveBeenCalledWith('manage-org/profile');
  });
});

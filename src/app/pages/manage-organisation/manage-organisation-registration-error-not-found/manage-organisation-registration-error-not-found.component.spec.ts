import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { ManageOrgRegErrorNotFoundComponent } from './manage-organisation-registration-error-not-found.component';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('ManageOrgRegErrorNotFoundComponent', () => {
  let component: ManageOrgRegErrorNotFoundComponent;
  let fixture: ComponentFixture<ManageOrgRegErrorNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageOrgRegErrorNotFoundComponent],
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({}),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegErrorNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct breadcrumb links', () => {
    const breadcrumbLinks = fixture.nativeElement.querySelectorAll(
      '.govuk-breadcrumbs__link'
    );
    expect(breadcrumbLinks.length).toBe(9);

    expect(breadcrumbLinks[0].textContent).toContain('REGITERATION_HOME');
    expect(breadcrumbLinks[1].textContent).toContain('CREATE_ACC');
    expect(breadcrumbLinks[2].textContent).toContain('ENTER_DETAIL');
    expect(breadcrumbLinks[3].textContent).toContain('REG_ORG');
    expect(breadcrumbLinks[4].textContent).toContain('ORG_ADMIN');
    expect(breadcrumbLinks[5].textContent).toContain('2FA_SETUP');
    expect(breadcrumbLinks[6].textContent).toContain('ORG_TYPE');
    expect(breadcrumbLinks[7].textContent).toContain('ORG_DETAILS');
    expect(breadcrumbLinks[8].textContent).toContain('NOT_FOUND');
  });

  it('should display the correct error message', () => {
    const errorMessage = fixture.nativeElement.querySelector('.govuk-body-l');
    expect(errorMessage.textContent).toContain(
      'We could not find any matching records for your search. Please check the details and try again'
    );
  });
});

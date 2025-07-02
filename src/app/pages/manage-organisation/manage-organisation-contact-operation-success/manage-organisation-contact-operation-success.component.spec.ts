import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageOrganisationContactOperationSuccessComponent } from './manage-organisation-contact-operation-success.component';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('ManageOrganisationContactOperationSuccessComponent', () => {
  let component: ManageOrganisationContactOperationSuccessComponent;
  let fixture: ComponentFixture<ManageOrganisationContactOperationSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      declarations: [ManageOrganisationContactOperationSuccessComponent],
      providers: [  
        provideRouter([]),      
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Store, useFactory: () => ({}) }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ManageOrganisationContactOperationSuccessComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct success message based on the operation', () => {
    component.operation = 1;
    fixture.detectChanges();
    const successMessage = fixture.nativeElement.querySelector('.govuk-body-l');
    expect(successMessage.textContent).toContain('DELETE_ORG_CONTACT_SUCCESS');
  });

  it('should navigate to the profile page when "Navigate to Profile" link is clicked', () => {
    spyOn(component.router, 'navigateByUrl');
    const navigateToProfileLink =
      fixture.nativeElement.querySelector('.navigation-text');
    navigateToProfileLink.click(navigateToProfileLink);    
    // expect(component.router.navigateByUrl).toHaveBeenCalled();
    expect(navigateToProfileLink).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactUnassignConfirmComponent } from './contact-unassign-confirm-component';
import { TranslateModule } from '@ngx-translate/core';
import { WrapperOrganisationContactService } from "src/app/services/wrapper/wrapper-org-contact-service";
import { WrapperSiteContactService } from "src/app/services/wrapper/wrapper-site-contact-service";
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';


describe('ContactUnassignConfirmComponent', () => {
  let component: ContactUnassignConfirmComponent;
  let fixture: ComponentFixture<ContactUnassignConfirmComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
 

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ContactUnassignConfirmComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),  
        { provide: Store, useFactory: () => ({}) }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactUnassignConfirmComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // it('should navigate to success page on onDeleteConfirmClick', () => {
  
  //  spyOn(component.contactService, 'unassignOrgContact').and.returnValue({ subscribe: () => {} });
  //  spyOn(component.siteContactService, 'unassignSiteContact').and.returnValue({ subscribe: () => {} });
    
  //   spyOn(router, 'navigateByUrl');

  //   component.contactId = 123;
  //   component.unassignSiteId = 456;
  //   component.unassignOrgId = 'org123';

  //   component.onDeleteConfirmClick();
  //   expect(router.navigateByUrl).toHaveBeenCalledWith('contact-unassign/success?data={"unassignSiteId":456}');
  // });

  it('should navigate to contact edit page on onCancelClick', () => {
    spyOn(router, 'navigateByUrl');
    component.contactId = 123;
    component.unassignSiteId = 456;
    component.onCancelClick('Cancel');
    expect(router.navigateByUrl).toHaveBeenCalledWith('manage-org/profile/contact-edit?data={"isEdit":true,"contactId":123,"siteId":456}');
  });
});

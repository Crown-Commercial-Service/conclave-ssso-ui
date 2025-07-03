import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactAssignSuccessComponent } from './contact-assign-success-component';
import { TranslateModule } from '@ngx-translate/core';
import { WrapperOrganisationSiteService } from 'src/app/services/wrapper/wrapper-org-site-service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'; 
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

describe('ContactAssignSuccessComponent', () => {
  let component: ContactAssignSuccessComponent;
  let fixture: ComponentFixture<ContactAssignSuccessComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,        
        TranslateModule.forRoot(),
      ],
      declarations: [ContactAssignSuccessComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),  
        { provide: Store, useFactory: () => ({}) }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAssignSuccessComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to profile on onNavigateToProfileClick', () => {
    spyOn(router, 'navigateByUrl');
    component.onNavigateToProfileClick();
    expect(router.navigateByUrl).toHaveBeenCalledWith('manage-org/profile');
  });

  it('should navigate to site edit on onNavigateToSiteClick', () => {
    spyOn(router, 'navigateByUrl');
    component.assigningSiteId = 123;
    component.onNavigateToSiteClick();
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'manage-org/profile/site/edit?data={"isEdit":true,"siteId":123}'
    );
  });

});


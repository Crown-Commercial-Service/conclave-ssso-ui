import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactUnassignSuccessComponent } from './contact-unassign-success-component';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ContactUnassignSuccessComponent', () => {
  let component: ContactUnassignSuccessComponent;
  let fixture: ComponentFixture<ContactUnassignSuccessComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ContactUnassignSuccessComponent],
      providers: [
        provideRouter([]),
        { provide: Store, useFactory: () => ({}) }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactUnassignSuccessComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
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
    component.unassignSiteId = 123;
    component.onNavigateToSiteClick();
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'manage-org/profile/site/edit?data={"isEdit":true,"siteId":123}'
    );
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { ManageDelegateService } from '../service/manage-delegate.service';
import { DelegatedUserStatusComponent } from './delegated-user-status.component';
import { TranslateModule } from '@ngx-translate/core';

describe('DelegatedUserStatusComponent', () => {
  let component: DelegatedUserStatusComponent;
  let fixture: ComponentFixture<DelegatedUserStatusComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let titleServiceSpy: jasmine.SpyObj<Title>;
  let wrapperOrganisationGroupServiceSpy: jasmine.SpyObj<WrapperOrganisationGroupService>;
  let wrapperUserDelegatedServiceSpy: jasmine.SpyObj<WrapperUserDelegatedService>;
  let manageDelegateServiceSpy: jasmine.SpyObj<ManageDelegateService>;

  beforeEach(async () => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const titleServiceSpyObj = jasmine.createSpyObj('Title', ['setTitle']);
    const wrapperOrganisationGroupServiceSpyObj = jasmine.createSpyObj(
      'WrapperOrganisationGroupService',
      ['getOrganisationRoles']
    );
    const wrapperUserDelegatedServiceSpyObj = jasmine.createSpyObj(
      'WrapperUserDelegatedService',
      ['getDelegatedEventLogs']
    );
    const manageDelegateServiceSpyObj = jasmine.createSpyObj(
      'ManageDelegateService',
      ['matchDelegatedDetailsOne']
    );

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [DelegatedUserStatusComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: { queryParams: { subscribe: () => {} } },
        },
        { provide: Router, useValue: routerSpyObj },
        { provide: Title, useValue: titleServiceSpyObj },
        {
          provide: WrapperOrganisationGroupService,
          useValue: wrapperOrganisationGroupServiceSpyObj,
        },
        {
          provide: WrapperUserDelegatedService,
          useValue: wrapperUserDelegatedServiceSpyObj,
        },
        {
          provide: ManageDelegateService,
          useValue: manageDelegateServiceSpyObj,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedUserStatusComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    titleServiceSpy = TestBed.inject(Title) as jasmine.SpyObj<Title>;
    wrapperOrganisationGroupServiceSpy = TestBed.inject(
      WrapperOrganisationGroupService
    ) as jasmine.SpyObj<WrapperOrganisationGroupService>;
    wrapperUserDelegatedServiceSpy = TestBed.inject(
      WrapperUserDelegatedService
    ) as jasmine.SpyObj<WrapperUserDelegatedService>;
    manageDelegateServiceSpy = TestBed.inject(
      ManageDelegateService
    ) as jasmine.SpyObj<ManageDelegateService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Template', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display the correct page title', () => {
      component.UserStatus = { header: 'Header' };
      fixture.detectChanges();
      const pageTitle = fixture.nativeElement.querySelector('.page-title');
      expect(pageTitle.textContent).toContain('Header');
    });
  });
});
